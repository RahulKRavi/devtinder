const express = require('express')
const app = express()
const mongoose = require('mongoose')
const connectDB = mongoose.connect("mongodb+srv://rahulkr02042000:gfceHgXKD3L4ZAUH@violetbooks.7suo0.mongodb.net/devTinder")
const User = require('./models/userModel')

app.post('/signup', async (req, res) => {
  try {
    const user = new User({
      firstName: "Rahul",
      lastName: "Ravi",
      email: "fuckyou@gmail.com",
      password: "8989",
      age: 23,
      gender: "Male"
    })
    await user.save()
    res.send("User added successfully")
  } catch(err) {
    console.log(err.message)
    res.status(404).send("Something fishy")
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



