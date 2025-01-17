const express = require('express')
const app = express()
app.use(express.json())
const mongoose = require('mongoose')
const connectDB = mongoose.connect("mongodb+srv://rahulkr02042000:gfceHgXKD3L4ZAUH@violetbooks.7suo0.mongodb.net/devTinder")
const User = require('./models/userModel')

app.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.send("User added successfully")
  } catch(err) {
    console.log(err.message)
    res.status(404).send("Something fishy")
  }
})

app.get('/feed', async (req, res) => {
  try {
    const users = await User.findOne({email: req.body.email})
    if(users.length !== 0){
      res.send(users)
    } else {
      res.status(404).send("User not found")
    }
  } catch(err) {
    res.status(401).send("Something shit happens")
  }
})
connectDB.then(()=>{
  console.log("Database Connected Succesfully")
  app.listen(2222,()=>{
    console.log("Server started running on 2222.......")
  })
}).catch(err=>{
  console.error("Database connection failed")
})



