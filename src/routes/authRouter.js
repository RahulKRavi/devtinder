const express = require('express')
const authRouter = express.Router();
const User = require('../models/userModel')
const {validateSignUp} = require('../helpers/validate')
const bcrypt = require('bcrypt')
const validator = require('validator')

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignUp(req)
    const {firstName, lastName, email, password} = req.body
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    })
    const savedUser = await user.save()
    const token = await savedUser.getJWT()
    res.cookie('token',token,{maxAge:900000})
    res.json({message:"User Saved Succefully", data: savedUser})
  } catch(err) {
    res.status(404).send("ERROR: " + err.message)
  }
})
authRouter.post('/login', async (req, res) => {
  try{
    const {email,password} = req.body
    if(!validator.isEmail(email)){
      throw new Error('Enter a Valid Email')
    }
    const user = await User.findOne({email: email})
    if(!user){
      throw new Error('Invalid Credentials')
    } else {
      const isPwdMatch = await user.validatePwd(password)
      if(!isPwdMatch){
        throw new Error('Invalid Credentials')
      }
      const token = await user.getJWT()
      res.cookie('token',token,{maxAge: 900000})
      res.json({message:"User LogedIn Succefully", data: user})
    }
  } catch(err) {
    res.status(404).send('ERROR: ' + err.message)
  }
})
authRouter.post('/logout', async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    expires: new Date(0)
  }).send("Logout Succesfull")
})

module.exports = authRouter