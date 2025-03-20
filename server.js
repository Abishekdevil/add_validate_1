const express=require("express")
const mongoose=require ("mongoose")
const app=express()
const PORT=4000
const bcrypt=require("bcrypt")
app.use(express.json())
require("dotenv").config()
const uri= process.env.uri
mongoose.connect(uri)
.then(()=>console.log("Database connected successfully"))
.catch((err)=>console.log("Error in connecting",err))

const Userdetails=new mongoose.Schema({
    UserName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const detail=mongoose.model('detail',Userdetails)


app.post('/',async(req,res)=>{
    try{
        const {UserName,Email,password}=req.body
        if(!UserName||!Email||!password){
            res.status(404).json({message:"Fill the required option"})
        }
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(password,saltRounds)
        const newUser=await detail.create({UserName,Email,password:hashedPass})
        res.status(201).json({message:"Successfully created",user:newUser})
    }
    catch(err){
        res.status(500).json({message:"Error in creating",error:err.message})
    }
})

app.get('/',async(req,res)=>{
    try{
        const detailss=await detail.find()
        res.status(200).json(detailss)
    }
    catch(err){
        res.status(500).json({mesage:"Error in fetching",error:err.message})
    }
})






app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})