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

const validateEditForm = (req) => {
  //Check any unallowed fields are there
  const allowedEditFields = ["firstName", "lastName", "age", "about", "gender", "photoURL"]
  const isAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
  return isAllowed
}
module.exports = {validateSignUp,validateEditForm}