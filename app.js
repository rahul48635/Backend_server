const express=require('express');
const app=express();
const authRouter=require('../backend/Router/authRoute');
const databaseconnect=require('../backend/config/databaseConfig');
const cookieParser=require('cookie-parser');
const cors=require('cors');

databaseconnect();
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth/',authRouter);
app.use('/',(req,res)=>{
    res.status(200).json({data:"JWT SERVER",});
})
module.exports=app;