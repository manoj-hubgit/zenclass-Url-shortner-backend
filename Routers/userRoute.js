import express from "express"
import {getUser, loginUser, registerUser, resetPassword } from "../Controllers/userController.js";
import authMiddleware from "../Middleware/AuthMiddleware.js";
import { forgetPassword } from "../Services/NodeMailer.js";


const router=express.Router();

router.post('/register-user',registerUser)
router.post('/login-user',loginUser)
router.get('/get-user',authMiddleware,getUser)
router.post('/forget-password',forgetPassword)
router.post('/reset-password/:id/:token',resetPassword)

export default router