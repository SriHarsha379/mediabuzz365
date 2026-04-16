const mongoose=require("mongoose");

const schema=new mongoose.Schema({
 title:String,
 description:String,
 category:String,
 city:String,

 images:[String], // 🔥 MULTIPLE IMAGES

 status:String,
 createdBy:String,
 approvedBy:String,
 rejectedBy:String,

 date:{type:Date,default:Date.now}
});

module.exports=mongoose.model("News",schema);
