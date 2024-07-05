import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./Database/config.js"
import userRouter from './Routers/userRoute.js'
import urlRouters from './Routers/urlRoute.js'
dotenv.config()
const app=express()

app.use(express.json())
app.use(cors({
    origin:"*",
    credentials:true
}))
connectDB();
app.use('/api/user',userRouter)
app.use('/api/url',urlRouters)
app.get('/',(req,res)=>{
    res.status(200).send("hi Welcome to the app")
})

app.listen(process.env.PORT,()=>{
    console.log("app is running successfully")
})