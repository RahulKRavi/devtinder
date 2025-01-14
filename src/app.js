const express = require('express')
const app = express()
app.use((req,res)=>{
  res.send("You suck")
})
app.listen(2222,()=>{
  console.log("Server started running on 2222.......")
})