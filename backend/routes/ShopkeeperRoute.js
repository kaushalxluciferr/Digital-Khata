import express from 'express'
import { addCustomer, addOrUpdateItems, deleteitem, getcustomer, signin, signup } from '../controller/shopController.js'

const shopRouter=express.Router()

shopRouter.post("/signup",signup)
shopRouter.post("/signin",signin)
shopRouter.post("/addcustomer",addCustomer)
shopRouter.post("/addorupdate",addOrUpdateItems)
shopRouter.post("/delete",deleteitem)
shopRouter.post("/getcustomer",getcustomer)

export default shopRouter