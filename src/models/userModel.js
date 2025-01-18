const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20
  },
  lastName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 20,
    required: true
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
        throw new Error("Invalid Gender Type")
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