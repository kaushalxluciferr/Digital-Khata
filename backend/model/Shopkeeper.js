import mongoose from "mongoose";

const shopkeeperSchema=new mongoose.Schema({
email:{type:String,required:true,unique:true},
password:{type:String,required:true}
})


const Shopkeeper=mongoose.model("Shopkeeper",shopkeeperSchema)

export default Shopkeeper