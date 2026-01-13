const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

/* LOGIN */
router.post("/login", async (req, res) => {

 try{
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
   return res.status(400).json({ msg: "User not found" });

  if(user.status==="blocked")
   return res.status(403).json({ msg: "Account blocked" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
   return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
   { id: user._id, role: user.role },
   process.env.JWT_SECRET,
   { expiresIn: "1d" }
  );

  res.json({
   token,
   role: user.role
  });

 }catch(err){
  res.status(500).json({msg:"Server error"});
 }
});

module.exports = router;
