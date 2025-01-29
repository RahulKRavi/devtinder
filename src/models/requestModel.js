const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ["ignored","interested","rejected","accepted"],
    required: true
  }
},
{
  timestamps: true
})

requestSchema.pre('save', function(next) {
  const requestConnection = this;
  if(requestConnection.senderId.equals(requestConnection.recieverId)){
    throw new Error("Cannot send request to yourself")
  }
  next();
})

const Request = mongoose.model('Request', requestSchema)

module.exports = Request
