const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
 const auth = req.headers.authorization;
 if(!auth) return res.sendStatus(401);

 try{
  jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
  next();
 }catch{
  res.sendStatus(401);
 }
};
