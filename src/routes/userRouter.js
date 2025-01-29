const express = require('express')
const userRouter = express.Router();
const User = require('../models/userModel')
const {userAuth} = require('../middlewares/auth')
const Request = require('../models/requestModel')
const USER_SAFE_DATA = ['firstName','lastName','age','about']

userRouter.get('/user/requests/recieved', userAuth,  async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestsRecieved = await Request.find({
      recieverId: loggedInUser._id,
      status: 'interested'
    }).populate('senderId',USER_SAFE_DATA)

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
    .populate('senderId',USER_SAFE_DATA)
    .populate('recieverId',USER_SAFE_DATA)


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

userRouter.get('/user/feeds', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit>50? 50:limit;
    const skip = (page-1)*limit
    
    const connections = await Request.find({
      $or:[
        {senderId: loggedInUser._id},
        {recieverId: loggedInUser._id}
      ]
    })
    const hiddenData = new Set();
    connections.forEach(item => {
      hiddenData.add(item.senderId);
      hiddenData.add(item.recieverId)
    })
    const feedData = await User.find({
      $and:[
        {_id:{$nin:Array.from(hiddenData)}},
        {_id:{$ne:loggedInUser._id}}
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)
    res.json({message: "Feed List", data: feedData})
  } catch (err) {
      res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = userRouter