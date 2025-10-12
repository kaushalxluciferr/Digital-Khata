
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import Shopkeeper from "../model/Shopkeeper.js"


const signup=async(req,res)=>{
try{
const {email,password}=req.body

const exemail=await Shopkeeper.find({email})
if(exemail){
    return res.json({success:false,
        message:"email Exist"
    })
}

const hashpass=await bcrypt.hash(password,10);

const user=await Shopkeeper.create({
    email,
    password:hashpass
})

const token = jwt.sign({id:user._id},process.env.SECRET_KEY)
return res.json({
    success:true,
    message:"signup successful",
    token
})
}catch(error){
    return res.json({
        success:false,
        message:error.message
    })
}
}


const signin=async(req,res)=>{
    try{
const {email,password}=req.body

const user=await Shopkeeper.find({email})

if(!user){
    return res.json({
        success:false,
        message:"something is wrong"
    })
}

const ismatch =await bcrypt.compare(password,user.password)
if(!ismatch){
    return res.json({
        success:false,
        message:"Something went wrong"
    })
}

const token=jwt.sign({id:user._id},process.env.SECRET_KEY)

return res.json({
    success:true,
    token
})

    }catch(error){
        return res.json({success:false,message:error.message})
    }
}



export {signin,signup}