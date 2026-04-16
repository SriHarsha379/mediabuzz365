const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 email:{
  type:String,
  unique:true,
  required:true
 },

 password:{
  type:String,
  required:true
 },

 aadhaar:{
  type:String,
  required:true
 },

 phone:{
  type:String,
  required:true
 },

 role:{
  type:String,
  enum:["super_admin","admin","editor","reporter"],
  default:"admin"
 },

 status:{
  type:String,
  enum:["pending","active","blocked"],
  default:"pending"
 },

 districts:{
  type:[String],
  default:[]
 },

 lastLogin: Date,
 lastIP: String

},{ timestamps:true });

module.exports = mongoose.model("User", userSchema);
