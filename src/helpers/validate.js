const validator = require('validator')

const validateSignUp = (req) => {
  const {firstName,lastName,email,password} = req.body
  if(!firstName || !lastName) {
    throw new Error("Name is not valid")
  }
  if(!validator.isEmail(email)){
    throw new Error("Email is not valid")
  }
  if(!validator.isStrongPassword(password)) {
    throw new Error('Password is weak')
  }
}

module.exports = validateSignUp