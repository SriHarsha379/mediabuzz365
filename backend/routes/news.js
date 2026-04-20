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
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

/* ================= ADD ================= */
router.post("/",
 auth,
 upload.array("imageFiles",10),
 async(req,res)=>{

 const user=req.user;

 if(user.role==="admin"){
  if(!user.districts.includes(req.body.city)){
   return res.status(403).json({msg:"No access"});
  }
 }

 const files=req.files || [];

 // Validate required fields
 const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
 const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
 const category = typeof req.body.category === "string" ? req.body.category.trim() : "";
 if (!title) return res.status(400).json({ msg: "Title is required" });
 if (!description) return res.status(400).json({ msg: "Description is required" });
 if (!category) return res.status(400).json({ msg: "Category is required" });
 if (title.length > 500) return res.status(400).json({ msg: "Title must be 500 characters or less" });
 if (description.length > 10000) return res.status(400).json({ msg: "Description must be 10000 characters or less" });

 // Image required for all categories except breaking news
 if (category !== "breaking" && files.length === 0) {
  return res.status(400).json({ msg: "At least one image is required for non-breaking news" });
 }

 const news = await News.create({
   ...req.body,
   title,
   description,
   category,
   status:"pending",
   createdBy:user.id,
   images: files.map(f=>"/uploads/"+f.filename)
 });

 req.app.get("io")
  .to("super-admin")
  .emit("news:new");

 res.json({msg:"Sent for approval"});
});

/* ================= PUBLIC ================= */
router.get("/",async(req,res)=>{
 const { category, city, page: pageQuery, limit: limitQuery } = req.query;

 let filter={status:"approved"};
 if(typeof category !== "undefined"){
  if(typeof category !== "string" || !/^[a-zA-Z0-9_-]{1,40}$/.test(category)){
   return res.status(400).json({ msg:"Invalid category" });
  }
  filter.category=category;
 }

 if(typeof city !== "undefined"){
  if(typeof city !== "string" || city.length > 100){
   return res.status(400).json({ msg:"Invalid city" });
  }
  filter.city=city;
 }

 const collation = { locale:"en", strength:2 }; // case-insensitive, accent-insensitive

 const hasPagination =
  typeof pageQuery !== "undefined" ||
  typeof limitQuery !== "undefined";

 if(!hasPagination){
  const data=await News.find(filter).collation(collation).sort({date:-1});
  return res.json(data);
 }

 const parsedPage = parseInt(pageQuery,10);
 const parsedLimit = parseInt(limitQuery,10);
 const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
 const limit =
  Number.isFinite(parsedLimit) && parsedLimit > 0
   ? Math.min(parsedLimit,MAX_PAGE_SIZE)
   : DEFAULT_PAGE_SIZE;

 const skip = (page - 1) * limit;

 const [total,items,counts] = await Promise.all([
  News.countDocuments(filter).collation(collation),
  News.find(filter).collation(collation).sort({date:-1}).skip(skip).limit(limit),
  News.aggregate([
   { $match: filter },
   { $group: { _id: "$category", count: { $sum: 1 } } }
  ])
 ]);

 const totalPages = Math.max(1,Math.ceil(total / limit));
 const categoryCounts = counts.reduce((acc,item)=>{
  acc[item._id || "unknown"] = item.count;
  return acc;
 },{});

 res.json({
  items,
  categoryCounts,
  pagination:{
   page,
   limit,
   total,
   totalPages,
   hasPrev: page > 1,
   hasNext: page < totalPages
  }
 });
});

/* ================= SINGLE ================= */
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
router.get("/admin/mystats",
 auth,
 allow("admin"),
 async(req,res)=>{
  try{
   const userId = String(req.user._id);
   const [total,pending,approved,rejected] = await Promise.all([
    News.countDocuments({createdBy:userId}),
    News.countDocuments({createdBy:userId,status:"pending"}),
    News.countDocuments({createdBy:userId,status:"approved"}),
    News.countDocuments({createdBy:userId,status:"rejected"})
   ]);
   res.json({ total, pending, approved, rejected });
  }catch(err){
   res.status(500).json({ msg:"Failed to load stats" });
  }
 });

router.get("/admin",
 auth,
 allow("admin"),
 async(req,res)=>{

 const user=req.user;
 const userId = String(user._id);

 const {status}=req.query;
 let filter={createdBy:userId};
 if(status) filter.status=status;

 const data=await News.find(filter).sort({date:-1});

 res.json(data);
});

/* ================= SUPER ================= */
router.get("/admin/stats",
 auth,
 allow("super_admin"),
 async(req,res)=>{
  try{
   const [total,pending,approved] = await Promise.all([
    News.countDocuments({}),
    News.countDocuments({status:"pending"}),
    News.countDocuments({status:"approved"})
   ]);

   res.json({ total, pending, approved });
  }catch(err){
   res.status(500).json({ msg:"Failed to load stats" });
  }
 });

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
 upload.array("imageFiles",10),
 async(req,res)=>{

 const user=req.user;
 const old=await News.findById(req.params.id);

 if(!old) return res.status(404).json({msg:"Not found"});

 if(user.role==="admin"){
  if(!user.districts.includes(old.city)){
   return res.status(403).json({msg:"No access"});
  }
 }

 const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
 const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
 const category = typeof req.body.category === "string" ? req.body.category.trim() : "";
 if (!title) return res.status(400).json({ msg: "Title is required" });
 if (!description) return res.status(400).json({ msg: "Description is required" });
 if (!category) return res.status(400).json({ msg: "Category is required" });
 if (title.length > 500) return res.status(400).json({ msg: "Title must be 500 characters or less" });
 if (description.length > 10000) return res.status(400).json({ msg: "Description must be 10000 characters or less" });

 const uploadedImages = req.files || [];
 const hasExistingImages = Array.isArray(old.images) && old.images.length > 0;
 if (category !== "breaking" && uploadedImages.length === 0 && !hasExistingImages) {
  return res.status(400).json({ msg: "At least one image is required for non-breaking news" });
 }

 let data={
  ...req.body,
  title,
  description,
  category,
  status:"pending"
 };

 if(uploadedImages.length){
  data.images=uploadedImages.map(f=>"/uploads/"+f.filename);
 }

 await News.findByIdAndUpdate(req.params.id,data);

 req.app.get("io")
  .to("super-admin")
  .emit("news:new");

 res.json({msg:"Updated"});
});

/* ================= DELETE ================= */
router.delete("/:id",
 auth,
 async(req,res)=>{

 const user=req.user;
 const old=await News.findById(req.params.id);

 if(!old) return res.status(404).json({msg:"Not found"});

 if(!["admin","super_admin"].includes(user.role)){
  return res.status(403).json({msg:"Not allowed"});
 }

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
