import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/userSchema.js";


dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashpassword });
    await newUser.save();
    res.status(200).json({ message: "Registered successfully", result: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error in registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetail = await User.findOne({ email });
    if (!userDetail) {
      return res.status(400).json({ message: "User not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, userDetail.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Not a valid password" });
    }
    const token = jwt.sign({ _id: userDetail._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    userDetail.token = token;
    await userDetail.save();
    res.status(200).json({ message: "Logged in successfully", token:token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error in login" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await User.findById(userID);
    res.status(200).json({ message: "Authorized user", data: [user] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error, failed to get user" });
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  jwt.verify(token,process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    try {
      const hash = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(id, { password: hash });
      res.status(200).json({ status: "Success" });
    } catch (err) {
      res.status(500).json({ status: "Internal server error", error: err.message });
    }
  });
};
