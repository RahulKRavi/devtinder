const express = require('express')
const userRouter = express.Router();
const User = require('../models/userModel')
const {userAuth} = require('../middlewares/auth')
const Request = require('../models/requestModel')

userRouter.get('/user/requests/recieved', userAuth,  async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestsRecieved = await Request.find({
      recieverId: loggedInUser._id,
      status: 'interested'
    }).populate('senderId',['firstName','lastName','age','about'])

    res.json({message:'Here is your connection requests',data: requestsRecieved})

  } catch(err) {
    res.status(403).send("Oh shit! Something bad happens")
  }
})

userRouter.get('/user/requests/connections', userAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const connections = await Request.find({
      $or:[
        {senderId: loggedInUser._id, status: 'accepted'},
        {recieverId: loggedInUser._id, status: 'accepted'}
      ]
    })
    .populate('senderId',['firstName','lastName','age','about'])
    .populate('recieverId',['firstName','lastName','age','about'])


    const data = connections.map((row)=>{
      if(loggedInUser._id.toString() === row.senderId._id.toString()){
        return row.recieverId
      }
       return row.senderId
    })
    res.json({message:"These are your connections", data})
  } catch (err) {
    res.status(400).send("ERROR: "+err.message)
  }
})
module.exports = userRouter