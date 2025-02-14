const mongoose = require('mongoose')
const connectDB = mongoose.connect("mongodb+srv://rahulkr02042000:gfceHgXKD3L4ZAUH@violetbooks.7suo0.mongodb.net/devTinder")


const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json())

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const authRouter = require('./routes/authRouter')
const profileRouter = require('./routes/profileRouter')
const requestRouter = require('./routes/requestRouter')
const userRouter = require('./routes/userRouter')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)


connectDB.then(()=>{
  console.log("Database Connected Succesfully")
  app.listen(2222,()=>{
    console.log("Server started running on 2222.......")
  })
}).catch(err=>{
  console.error("Database connection failed")
})



