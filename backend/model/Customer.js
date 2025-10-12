import mongoose from "mongoose";

const customerSchema=new mongoose.Schema({
    shopkeeperId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shopkeeper",
        required:true
    },
    username:{type:String,required:true}
})

customerSchema.index({ shopkeeperId: 1, username: 1 }, { unique: true });

const Customer=mongoose.model("Customer",customerSchema)

export default Customer

