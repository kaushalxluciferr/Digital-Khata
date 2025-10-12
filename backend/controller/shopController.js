
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import Shopkeeper from "../model/Shopkeeper.js"
import Customer from '../model/Customer.js'
import Item from '../model/Item.js'


const signup=async(req,res)=>{
try{
const {email,password}=req.body

const exemail=await Shopkeeper.findOne({email})

if(exemail){
    return res.json({success:false,
        message:"email Exxist"
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

const user=await Shopkeeper.findOne({email})

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


const addCustomer=async(req,res)=>{
    try{
       const {shopkeeperId,username}=req.body

       const exuser=await Customer.findOne({username})

       if(exuser){
        return res.json({
           success:false,
           message:"Customer Exists" 
        })
       }
       const user=await Customer.create({
        shopkeeperId,
        username
       })
       return res.json({
        success:true,
        message:"successfully added"
       })

    } catch(error){
          return res.json({

          })  
        }
}


const addOrUpdateItems = async (req, res) => {
  try {
    const { customerId, date, items } = req.body

    if (!customerId || !date || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "customerId, date, and items array are required",
      })
    }

    // ✅Convert date to proper Date object (in case frontend sends string)
    const formattedDate = new Date(date);

    // ✅ Check if document for same customer & date exists
    const existingRecord = await Item.findOne({ customerId, date: formattedDate });

    if (existingRecord) {
      // ✅ If exists → push new items to existing items array
      existingRecord.items.push(...items);
      await existingRecord.save();

      return res.json({
        success: true,
        message: "Items added successfully to existing date",
        data: existingRecord,
      });
    } else {
      // ✅ If not exists → create new document
      const newRecord = await Item.create({
        customerId,
        date: formattedDate,
        items,
      });

      return res.json({
        success: true,
        message: "New item record created successfully",
        data: newRecord,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


const deleteitem=async(req,res)=>{
    try{
const {_id}=req.body
if(!_id){
    return res.json({
        success:false,
        message:"Item id is required"
    })
}
const deletedItem=await Item.findByIdAndDelete(_id)

if(!deletedItem){
    return res.json({
        success:false,
        message:"Item not found"
    })
}
return res.json({
    success:true,
    message:"Deleted Successfully"
})

    }catch(error){
        return res.json({
            success:false,

        })
    }
}


const getcustomer=async(req,res)=>{
    try{
        const {shopkeeperId}=req.body

        if(!shopkeeperId){
            return res.json({
                success:false,
                message:"no shopkeper id found"
            })
        }
        const customers=await Customer.find({shopkeeperId})
         
         return res.json({success:true,
            customers
         })
    }catch(error){
        return res.json({
            success:false,
            message:error.message
        })
    }
}

const updatecustomername=async(req,res)=>{
    try{
        const {_id,username}=req.body
        const exuser=await Customer.findOne({username})
        if(exuser){
            return res.json({
                success:false,
                message:"username exist"
            })
        }
        const user=await Customer.findByIdAndUpdate(_id,{username})
        
    if (!user) {
      return res.json({
        success: false,
        message: "Customer not found",
      })
    }
        return res.json({
            success:true,
            message:"Updated Successfull"
        })
    }catch(error){
        return res.json({
            success:false,
            message:error.message
        })
    }
}



export {signin,signup,addCustomer,addOrUpdateItems,deleteitem,getcustomer}