import jwt from 'jsonwebtoken';
import User from '../Models/userSchema.js';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async(req,res,next)=>{
    const token = req.header('Authorization')
    if(!token){
       return res.status(400).json({message:"token not found"})
    }
    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=decode
        const user=await User.findById(req.user._id)
        if(!user){
            res.status().json({message:"access denied not a valid user"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"invalid token internal server error"})
    }
}

export default authMiddleware;