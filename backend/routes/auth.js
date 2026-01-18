const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
console.log("USER MODEL TYPE =", typeof User);

console.log("JWT SECRET =", process.env.JWT_SECRET);

/* LOGIN */
router.post("/login", async (req, res) => {

 try{
  let { email, password } = req.body;

  if(!email || !password){
   return res
    .status(400)
    .json({ msg: "All fields required" });
  }

  // 🔥 IMPORTANT FIX
  email = email.toLowerCase().trim();

  const user = await User.findOne({ email });

  if (!user){
   return res
    .status(400)
    .json({ msg: "User not found" });
  }

  if(user.status==="blocked"){
   return res
    .status(403)
    .json({ msg: "Account blocked" });
  }

  const match = await bcrypt.compare(
   password,
   user.password
  );

  if (!match){
   return res
    .status(400)
    .json({ msg: "Wrong password" });
  }

  const token = jwt.sign(
   {
    id: user._id,
    role: user.role
   },
   process.env.JWT_SECRET,
   { expiresIn: "1d" }
  );

  res.json({
   token,
   user:{
    id:user._id,
    name:user.name,
    email:user.email,
    role:user.role
   }
  });

 }catch(err){
  console.error("LOGIN ERROR:",err);
  res.status(500)
   .json({msg:"Server error"});
 }
});

module.exports = router;
