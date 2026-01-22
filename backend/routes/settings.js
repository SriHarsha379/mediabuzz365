const router = require("express").Router();
const Settings = require("../models/Settings");

/* GET LINKS */
router.get("/youtube", async(req,res)=>{
 let s = await Settings.findOne();
 if(!s){
  s = await Settings.create({});
 }
 res.json(s.youtubeLinks);
});

/* UPDATE LINKS */
router.post("/youtube", async(req,res)=>{
 const { links } = req.body;

 if(!Array.isArray(links) || links.length!==3){
  return res.status(400).json({
   msg:"Exactly 3 links required"
  });
 }

 let s = await Settings.findOne();
 if(!s) s = await Settings.create({});

 s.youtubeLinks = links;
 await s.save();

 res.json({
  msg:"YouTube links updated",
  links
 });
});

module.exports = router;
