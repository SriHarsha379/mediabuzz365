const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
 try{
  let { email, password } = req.body;

  if(!email || !password){
   return res.status(400).json({ msg:"All fields required" });
  }

  email = email.toLowerCase().trim();

  const user = await User.findOne({ email });
  if(!user){
   return res.status(400).json({ msg:"User not found" });
  }

  /* 🔒 BLOCK IF NOT APPROVED */
  if(user.role==="admin" && user.status!=="active"){
   return res.status(403).json({
    msg:"⏳ Your account is pending approval by Super Admin"
   });
  }

  if(user.status==="blocked"){
   return res.status(403).json({ msg:"Account blocked" });
  }

  const match = await bcrypt.compare(password,user.password);
  if(!match){
   return res.status(400).json({ msg:"Wrong password" });
  }

  const token = jwt.sign(
   { id:user._id, role:user.role },
   process.env.JWT_SECRET,
   { expiresIn:"1d" }
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
  res.status(500).json({msg:"Server error"});
 }
});

/* ================= REGISTER ADMIN (PUBLIC) ================= */
router.post("/register-admin", async (req,res)=>{
 try{
  let { name,email,aadhaar,phone,password } = req.body;

  if(!name || !email || !aadhaar || !phone || !password){
   return res.status(400).json({ msg:"All fields required" });
  }

  email = email.toLowerCase().trim();

  const exist = await User.findOne({ email });
  if(exist){
   return res.status(400).json({ msg:"Email already registered" });
  }

  const hashed = await bcrypt.hash(password,10);

  const user = await User.create({
   name,
   email,
   password:hashed,
   role:"admin",
   status:"pending",
   aadhaar,
   phone,
   districts:[]
  });

  /* 🔔 SOCKET NOTIFICATION */
  const io = req.app.get("io");

  io.to("super-admin").emit("admin:registered",{
   name:user.name,
   email:user.email,
   phone:user.phone
  });

  console.log("✅ admin:registered emitted");

  res.json({
   msg:"✅ Registered successfully. Waiting for approval"
  });

 }catch(err){
  console.error(err);
  res.status(500).json({ msg:"Server error" });
 }
});

module.exports = router;
