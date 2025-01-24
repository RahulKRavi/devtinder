const express = require('express')
const userRouter = express.Router();
const User = require('../models/userModel')
const {userAuth} = require('../middlewares/auth')

userRouter.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const userInfo = await User.findByIdAndUpdate(userId,{age: 28})
    res.send("User data got updated")
  } catch(err) {
    res.status(403).send("Oh shit! Something bad happens")
  }
})

module.exports = userRouter