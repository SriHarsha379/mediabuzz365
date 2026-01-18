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

/* ADD NEWS */
router.post("/",
 auth,
 upload.single("imageFile"),
 async(req,res)=>{

 const user=req.user;

 if(user.role==="admin"){
  if(!user.districts.includes(req.body.city)){
   return res.status(403).json({
    msg:"No access to this district"
   });
  }
 }

 const news=await News.create({
  ...req.body,
  status:"pending",
  createdBy:user.id,
  image:req.file?"/uploads/"+req.file.filename:""
 });

 res.json({msg:"Sent for approval"});
});

/* ================= PUBLIC ================= */
router.get("/", async (req,res)=>{
 const { category } = req.query;

 let filter={ status:"approved" };
 if(category) filter.category=category;

 const data = await News.find(filter).sort({date:-1});
 res.json(data);
});

/* ================= ADMIN FETCH ================= */
router.get("/admin",
 auth,
 allow("admin"),
 async(req,res)=>{

  const user=req.user;

  const data = await News.find({
   city:{ $in:user.districts }
  }).sort({date:-1});

  res.json(data);
});

/* ================= SUPER ADMIN ================= */
router.get("/admin/all",
 auth,
 allow("super_admin"),
 async(req,res)=>{

  const {status}=req.query;
  let filter={};
  if(status) filter.status=status;

  const data = await News.find(filter).sort({date:-1});
  res.json(data);
});

/* ================= UPDATE ================= */
router.put("/:id",
 auth,
 upload.single("imageFile"),
 async (req,res)=>{

 try{
  const user=req.user;
  const old = await News.findById(req.params.id);

  if(!old) return res.status(404).json({msg:"Not found"});

  if(user.role==="admin"){
   if(!user.districts.includes(old.city)){
    return res.status(403).json({
     msg:"No access to edit this district"
    });
   }
  }

  let data={...req.body};

  if(req.file){
   data.image="/uploads/"+req.file.filename;
  }

  data.status="pending";

  await News.findByIdAndUpdate(req.params.id,data);

  res.json({msg:"Updated, sent for re-approval"});

 }catch(err){
  res.status(500).json({error:"Update failed"});
 }
});

/* ================= DELETE ================= */
router.delete("/:id",
 auth,
 allow("super_admin"),
 async (req,res)=>{
  await News.findByIdAndDelete(req.params.id);
  res.json({msg:"Deleted"});
});

/* ================= APPROVE ================= */
router.patch("/approve/:id",
 auth,
 allow("super_admin"),
 async (req,res)=>{

  await News.findByIdAndUpdate(req.params.id,{
   status:"approved",
   approvedBy:req.user.id
  });

  res.json({msg:"Approved"});
});

/* ================= REJECT ================= */
router.patch("/reject/:id",
 auth,
 allow("super_admin"),
 async(req,res)=>{

  await News.findByIdAndUpdate(req.params.id,{
   status:"rejected",
   rejectedBy:req.user.id
  });

  res.json({msg:"Rejected"});
});

module.exports = router;
