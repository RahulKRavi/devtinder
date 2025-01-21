const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid Email Address:" + value)
      }
    }
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Password is weak:" + value )
      }
    }
  },
  age: {
    type: Number,
    min: 1,
    max: 2
  },
  gender: {
    type: String,
    validate(value){
      if(!['male','female','others'].includes(value)){
        throw new Error("Invalid Gender Type:" + value)
      }
    },
  },
  about: {
      type: String,
      minLength: 8,
      maxLength: 100,
      default: "This is the default about info of user"
  }
},
{
  timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User