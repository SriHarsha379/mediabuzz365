const mongoose = require("mongoose");

const connectDB = async ()=>{

 try{
  await mongoose.connect(
   process.env.MONGO_URI,
   {
    dbName: process.env.DB_NAME
   }
  );

  console.log(
   "✅ MongoDB Connected to:",
   process.env.DB_NAME
  );

 }catch(err){
  console.error(err);
  process.exit(1);
 }
};

module.exports = connectDB;
