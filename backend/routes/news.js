const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");
const News = require("../models/News");

/* FILE UPLOAD */
const storage = multer.diskStorage({
 destination:"uploads/",
 filename:(req,file,cb)=>{
  cb(null,Date.now()+"-"+file.originalname);
 }
});
const upload = multer({storage});

/* ================= ADD ================= */
router.post("/",
 auth,
 upload.single("imageFile"),
 async(req,res)=>{

 const user=req.user;

 if(user.role==="admin"){
  if(!user.districts.includes(req.body.city)){
   return res.status(403).json({msg:"No access"});
  }
 }

 const news = await News.create({
  ...req.body,
  status:"pending",
  createdBy:user.id,
  image:req.file?"/uploads/"+req.file.filename:""
 });

 req.app.get("io")
  .to("super-admin")
  .emit("news:new");

 res.json({msg:"Sent for approval"});
});

/* ================= PUBLIC ================= */
router.get("/",async(req,res)=>{
 const {category}=req.query;

 let filter={status:"approved"};
 if(category) filter.category=category;

 const data=await News.find(filter).sort({date:-1});
 res.json(data);
});
/* ================= SINGLE NEWS ================= */
router.get("/single/:id", async (req,res)=>{
 try{
  const news = await News.findById(req.params.id);
  if(!news) return res.status(404).json({msg:"Not found"});
  res.json(news);
 }catch(e){
  res.status(500).json({msg:"error"});
 }
});


/* ================= ADMIN ================= */
router.get("/admin",
 auth,
 allow("admin"),
 async(req,res)=>{

 const user=req.user;

 const data=await News.find({
  city:{ $in:user.districts }
 }).sort({date:-1});

 res.json(data);
});

/* ================= SUPER ================= */
router.get("/admin/all",
 auth,
 allow("super_admin"),
 async(req,res)=>{

 const {status}=req.query;
 let filter={};
 if(status) filter.status=status;

 const data=await News.find(filter).sort({date:-1});
 res.json(data);
});

/* ================= UPDATE ================= */
router.put("/:id",
 auth,
 upload.single("imageFile"),
 async(req,res)=>{

 const user=req.user;
 const old=await News.findById(req.params.id);

 if(!old) return res.status(404).json({msg:"Not found"});

 if(user.role==="admin"){
  if(!user.districts.includes(old.city)){
   return res.status(403).json({msg:"No access"});
  }
 }

 let data={
  ...req.body,
  status:"pending"
 };

 if(req.file){
  data.image="/uploads/"+req.file.filename;
 }

 await News.findByIdAndUpdate(req.params.id,data);

 req.app.get("io")
  .to("super-admin")
  .emit("news:new");

 res.json({msg:"Updated"});
});

/* ================= DELETE (ADMIN + SUPER) ================= */
router.delete("/:id",
 auth,
 async(req,res)=>{

 const user=req.user;
 const old=await News.findById(req.params.id);

 if(!old) return res.status(404).json({msg:"Not found"});

 /* ROLE CHECK */
 if(!["admin","super_admin"].includes(user.role)){
  return res.status(403).json({msg:"Not allowed"});
 }

 /* ADMIN DISTRICT CHECK */
 if(user.role==="admin"){
  if(!user.districts.includes(old.city)){
   return res.status(403).json({msg:"No access"});
  }
 }

 await News.findByIdAndDelete(req.params.id);

 const io=req.app.get("io");

 io.to("public").emit("news:deleted");
 io.to(`admin:${old.createdBy}`)
   .emit("news:deleted");

 res.json({msg:"Deleted successfully"});
});

/* ================= APPROVE ================= */
router.patch("/approve/:id",
 auth,
 allow("super_admin"),
 async(req,res)=>{

 const old=await News.findById(req.params.id);

 await News.findByIdAndUpdate(
  req.params.id,
  { status:"approved", approvedBy:req.user.id }
 );

 const io=req.app.get("io");

 io.to("public").emit("news:approved");
 io.to(`admin:${old.createdBy}`)
   .emit("news:approved");
 io.to("super-admin")
   .emit("stats:update");

 res.json({msg:"Approved"});
});

/* ================= REJECT ================= */
router.patch("/reject/:id",
 auth,
 allow("super_admin"),
 async(req,res)=>{

 const old=await News.findById(req.params.id);

 await News.findByIdAndUpdate(
  req.params.id,
  { status:"rejected", rejectedBy:req.user.id }
 );

 req.app.get("io")
  .to(`admin:${old.createdBy}`)
  .emit("news:rejected");

 res.json({msg:"Rejected"});
});

module.exports = router;
