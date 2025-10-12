import express from 'express'
import { addCustomer, addOrUpdateItems, deletecustomer, deleteitem, getcustomer, getitemofcustomer, signin, signup, updatecustomername } from '../controller/shopController.js'

const shopRouter=express.Router()

shopRouter.post("/signup",signup)
shopRouter.post("/signin",signin)
shopRouter.post("/addcustomer",addCustomer)
shopRouter.post("/deletecustomer",deletecustomer)
shopRouter.post("/addorupdate",addOrUpdateItems)
shopRouter.post("/delete",deleteitem)
shopRouter.post("/getcustomer",getcustomer)
shopRouter.post("/updatecustomername",updatecustomername)
shopRouter.post("/getiteminfo",getitemofcustomer)

export default shopRouter