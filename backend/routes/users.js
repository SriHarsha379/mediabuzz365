const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Audit = require("../models/Audit");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");

const router = express.Router();

/* CREATE */
router.post("/",
 auth,
 allow("super_admin"),
 async(req,res)=>{

 const {name,email,password,role}=req.body;

 const hash=await bcrypt.hash(password,10);

 const user=await User.create({
  name,email,password:hash,role
 });

 await Audit.create({
  action:"CREATE_USER",
  performedBy:req.user.id,
  target:user.email
 });

 res.json(user);
});

/* LIST */
router.get("/",
 auth,
 allow("super_admin"),
 async(req,res)=>{
 const users=await User.find().select("-password");
 res.json(users);
});

/* BLOCK */
router.patch("/block/:id",
 auth,
 allow("super_admin"),
 async(req,res)=>{

 await User.findByIdAndUpdate(req.params.id,{status:"blocked"});

 await Audit.create({
  action:"BLOCK_USER",
  performedBy:req.user.id,
  target:req.params.id
 });

 res.json({msg:"Blocked"});
});

/* ACTIVATE */
router.patch("/activate/:id",
 auth,
 allow("super_admin"),
 async(req,res)=>{

 await User.findByIdAndUpdate(req.params.id,{status:"active"});

 await Audit.create({
  action:"ACTIVATE_USER",
  performedBy:req.user.id,
  target:req.params.id
 });

 res.json({msg:"Activated"});
});

module.exports=router;
