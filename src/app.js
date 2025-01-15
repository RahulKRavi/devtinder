const express = require('express')
const app = express()

const {adminAuth} = require('./middlewares/auth')


app.get('/admin/getUserData', adminAuth, (req, res) => {
  res.send("All user Data is loaded")
})

app.get('/admin/getProductData', adminAuth, (req, res) => {
  res.send("All product data is loaded")
})

app.listen(2222,()=>{
  console.log("Server started running on 2222.......")
})