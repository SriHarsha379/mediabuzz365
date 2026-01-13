require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

async function seed() {

  const exist = await User.findOne({
    email: "super@mediabuzz365.in"
  });

  if (exist) {
    console.log("Super admin already exists");
    process.exit();
  }

  const hash = await bcrypt.hash("Super@123", 10);

  await User.create({
    name: "Super Admin",
    email: "super@mediabuzz365.in",
    password: hash,
    role: "super_admin"
  });

  console.log("✅ Super admin created");
  process.exit();
}

seed();
