import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDb from './config/mongodb.js'
import shopRouter from './routes/ShopkeeperRoute.js'



dotenv.config()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors)


await connectDb()

app.use('/api/shop',shopRouter)
app.get('',(req,res)=>{
    res.send("hey sanamiaa")
})


app.listen(3000)