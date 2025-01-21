const jwt = require('jsonwebtoken')
const User = require("../models/userModel")


const userAuth =  async (req, res, next) => {
  try{
    const {token} = req.cookies
    if(!token){
      throw new Error("Session expired")
    }
    const {_id} = jwt.verify(token, 'ThengaMan')
    const user = await User.findById(_id)
    if(!user) {
      throw new Error("User is not found")
    }
    req.user = user
    next();
  } catch (err) {
    res.status(401).send("ERROR: " + err.message)
  }

}

module.exports = {
  userAuth
}