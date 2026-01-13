const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");
const News = require("../models/News");

/* FILE UPLOAD */
const storage = multer.diskStorage({
 destination:"uploads/",
 filename:(req,file,cb)=>{
  cb(null, Date.now()+"-"+file.originalname);
 }
});
const upload = multer({storage});

/* ---------------- ADD NEWS ---------------- */
router.post("/",
 auth,
 upload.single("imageFile"),
 async (req,res)=>{

 try{
  const news = await News.create({
   ...req.body,
   image:req.file?"/uploads/"+req.file.filename:"",
   createdBy:req.user.id,
   status:"pending"
  });

  res.json({msg:"Added", news});

 }catch(err){
  res.status(500).json({error:"Add failed"});
 }
});

/* ---------------- GET ALL NEWS ---------------- */
router.get("/", async (req,res)=>{
 try{
  const { category, status } = req.query;
  let filter={};

  if(category) filter.category = category;
  if(status) filter.status = status;

  const data = await News
    .find(filter)
    .sort({date:-1});

  res.json(data);

 }catch(err){
  res.status(500).json({error:"Fetch failed"});
 }
});

/* ---------------- GET SINGLE NEWS ---------------- */
router.get("/:id", async (req,res)=>{
 try{
  const news = await News.findById(req.params.id);

  if(!news){
   return res
    .status(404)
    .json({error:"Not found"});
  }

  res.json(news);

 }catch(err){
  res.status(500).json({error:"Fetch failed"});
 }
});

/* ---------------- UPDATE NEWS ---------------- */
router.put("/:id",
 auth,
 upload.single("imageFile"),
 async (req,res)=>{

 try{
  let data={...req.body};

  if(req.file){
   data.image="/uploads/"+req.file.filename;
  }

  await News.findByIdAndUpdate(req.params.id,data);
  res.json({msg:"Updated"});

 }catch(err){
  res.status(500).json({error:"Update failed"});
 }
});

/* ---------------- DELETE NEWS ---------------- */
router.delete("/:id",
 auth,
 allow("super_admin","admin"),
 async (req,res)=>{

 try{
  await News.findByIdAndDelete(req.params.id);
  res.json({msg:"Deleted"});

 }catch(err){
  res.status(500).json({error:"Delete failed"});
 }
});

/* ---------------- APPROVE NEWS ---------------- */
router.patch("/approve/:id",
 auth,
 allow("super_admin","admin","editor"),
 async (req,res)=>{

 try{
  await News.findByIdAndUpdate(req.params.id,{
   status:"approved",
   approvedBy:req.user.id
  });

  res.json({msg:"Approved"});

 }catch(err){
  res.status(500).json({error:"Approve failed"});
 }
});

router.patch("/reject/:id",
 auth,
 allow("super_admin","admin","editor"),
 async(req,res)=>{

  await News.findByIdAndUpdate(req.params.id,{
   status:"rejected"
  });

  res.json({msg:"Rejected"});
});

module.exports = router;
