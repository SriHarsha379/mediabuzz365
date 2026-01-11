const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const auth = require("../middleware/authMiddleware");

const FILE = path.join(__dirname,"../data/news.json");

/* HELPERS */
const read = () => JSON.parse(fs.readFileSync(FILE));
const write = d => fs.writeFileSync(FILE, JSON.stringify(d,null,2));

/* UPLOAD */
const storage = multer.diskStorage({
 destination:"uploads/",
 filename:(req,file,cb)=>cb(null,Date.now()+"-"+file.originalname)
});
const upload = multer({storage});

/* ================= ADD ================= */
router.post("/", auth, upload.single("imageFile"), (req,res)=>{

 const news = read();

 news.push({
  id:Date.now(),
  ...req.body,
  image:req.file?"/uploads/"+req.file.filename:"",
  date:new Date()
 });

 write(news);
 res.json({msg:"Added"});
});

/* ================= GET ================= */
router.get("/",(req,res)=>{
 res.json(read());
});

/* ================= UPDATE ================= */
router.put("/:id", auth, upload.single("imageFile"), (req,res)=>{

 let news = read();

 news = news.map(n=>{
  if(n.id==req.params.id){
   return {
    ...n,
    ...req.body,
    image:req.file?"/uploads/"+req.file.filename:n.image
   }
  }
  return n;
 });

 write(news);
 res.json({msg:"Updated"});
});

/* ================= DELETE ================= */
router.delete("/:id", auth,(req,res)=>{
 const news = read().filter(n=>n.id!=req.params.id);
 write(news);
 res.json({msg:"Deleted"});
});

module.exports = router;
