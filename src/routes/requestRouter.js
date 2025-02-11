const express = require('express')
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const Request = require('../models/requestModel');
const User = require('../models/userModel');
const { Types } = require('mongoose');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res)=>{
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status
    const recieverUser = await User.findById(toUserId)
    const senderUser = await User.findById(fromUserId)

    if(!recieverUser){
      return res.status(400).send("Reciever user does not exists")
    }

    const allowedStatus =['ignored', 'interested']
    if(!allowedStatus.includes(status)) {
      return res.status(400).send("Invalide status: " + status)
    }

    const existingConnection = await Request.findOne({$or:[
      {senderId: fromUserId, recieverId: toUserId},
      {senderId: toUserId, recieverId: fromUserId}
    ]})

    if(existingConnection){
      return res.status(400).send("Connection already exists")
    }

    const requestConnection = await Request({
      senderId: fromUserId,
      recieverId: toUserId,
      status: status
    })

    await requestConnection.save()

    res.json({
      message: senderUser.firstName + " is " + status + " in " + recieverUser.firstName,
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }

})

requestRouter.post('/request/recieved/:status/:requestId', userAuth, async (req, res) => {
  try{
    const {status, requestId} = req.params;
    const loggedInUser = req.user;
    const allowedStatus =['accepted', 'rejected']

    if(!allowedStatus.includes(status)) {
      return res.status(400).send("Invalide status: " + status)
    }

    const requestConnection = await Request.findOne({
      _id: requestId,
      recieverId: loggedInUser._id,
      status: 'interested'
    })

    if(!requestConnection){
      return res.status(400).send('Connection request does not exists')
    }

    requestConnection.status = status;
    await requestConnection.save();

    res.json({
      message: loggedInUser.firstName + " is " + status + requestConnection?.senderId?.firstName,
    })

  } catch (err) {
      res.status(400).send("ERROR: " + err.message)
  }
})
module.exports = requestRouter