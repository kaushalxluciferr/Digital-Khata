import express from 'express'
import { signin, signup } from '../controller/shopController.js'

const shopRouter=express.Router()

shopRouter.post("/signup",signup)
shopRouter.post("/signin",signin)


export default shopRouter