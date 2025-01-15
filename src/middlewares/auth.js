const adminAuth =  (req, res, next) => {
  const token = 'ac'
  const isAdminAuth = token === 'abc';
  if(isAdminAuth){
    next();
  } else {
    res.status(401).send("Who in the blue hell are you")
  }
}

module.exports = {
  adminAuth
}