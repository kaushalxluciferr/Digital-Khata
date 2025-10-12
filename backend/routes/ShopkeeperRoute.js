import express from 'express'
import { addCustomer, addOrUpdateItems, deleteitem, signin, signup } from '../controller/shopController.js'

const shopRouter=express.Router()

shopRouter.post("/signup",signup)
shopRouter.post("/signin",signin)
shopRouter.post("/addcustomer",addCustomer)
shopRouter.post("/addorupdate",addOrUpdateItems)
shopRouter.post("/delete",deleteitem)

export default shopRouter