const express = require('express')
const app = express()
app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const mongoose = require('mongoose')
const connectDB = mongoose.connect("mongodb+srv://rahulkr02042000:gfceHgXKD3L4ZAUH@violetbooks.7suo0.mongodb.net/devTinder")
const User = require('./models/userModel')
const validateSignUp = require('./helpers/validate')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const {userAuth} = require('./middlewares/auth')


app.post('/signup', async (req, res) => {
  try {
    validateSignUp(req)
    const {firstName, lastName, email, password} = req.body
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash
    })
    await user.save()
    res.send("User added successfully")
  } catch(err) {
    console.log(err.message)
    res.status(404).send("ERROR: " + err.message)
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

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    console.log(await User.findByIdAndDelete(userId))
    res.send("User is Deleted")
  } catch (err) {
    res.status(402).send("Oh shit! Something bad happens")
  }
})

app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const userInfo = await User.findByIdAndUpdate(userId,{age: 28})
    res.send("User data got updated")
  } catch(err) {
    res.status(403).send("Oh shit! Something bad happens")
  }
})

app.post('/login', async (req, res) => {
  try{
    const {email,password} = req.body
    if(!validator.isEmail(email)){
      throw new Error('Enter a Valid Email')
    }
    const user = await User.findOne({email: email})
    if(!user){
      throw new Error('Invalid Credentials')
    } else {
      const isPwdMatch = await bcrypt.compare(password,"$2b$10$iXWvproTe5yEkbbU6WRRTOYHApqBlc1CfBSV.TZQkTcdX5O010aa6")
      if(!isPwdMatch){
        throw new Error('Invalid Credentials')
      }
      const token = jwt.sign({_id:user._id},'ThengaMan')
      res.cookie('token',token)
      res.send("User veryified")
    }
  } catch(err) {
    res.status(404).send('ERROR: ' + err.message)
  }
})

app.get('/profile', userAuth, async (req, res) => {
  try{
    const user = req.user
    res.send(user)
  } catch(err) {
    res.status(401).send("ERROR "+err.message )
  }

})
app.post('/sendConnectionRequest', userAuth, async (req, res)=>{
  try{
    res.send("Request Send")
  } catch (err) {
    
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



