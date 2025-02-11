const express = require('express')
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const {validateEditForm} = require('../helpers/validate')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try{
    const user = req.user
    res.json({message: "Profile Loaded Succesfully", data: user})
  } catch(err) {
    res.status(400).send("ERROR " + err.message )
  }

})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try{
    if(!validateEditForm(req)){
      throw new Error("Invalid Entry")
    }
    const existingData = req.user
    Object.keys(req.body).forEach(key => existingData[key] = req.body[key] ) 
    await existingData.save();
    res.send("User updated succefully")

  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  
})

module.exports = profileRouter