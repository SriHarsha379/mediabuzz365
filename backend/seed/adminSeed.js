require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedAdmin(){
 await mongoose.connect(process.env.MONGO_URI);

 const email="super@mediabuzz365.in";
 const plainPass="admin123";

 const hash=await bcrypt.hash(plainPass,10);

 await User.findOneAndUpdate(
  {email},
  {password:hash,role:"super_admin",status:"active"},
  {upsert:true}
 );

 console.log("✅ Admin password reset");

 process.exit();
}

seedAdmin();
