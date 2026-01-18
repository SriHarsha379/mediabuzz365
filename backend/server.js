require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

connectDB();

const app = express();

/* ================= SECURITY ================= */

app.use(cors({
 origin:true,
 credentials:true,
 allowedHeaders:["Content-Type","Authorization"]
}));


app.use(express.json({limit:"10mb"}));

/* ================= UPLOADS ================= */

const uploadDir = path.join(__dirname,"uploads");

if(!fs.existsSync(uploadDir)){
 fs.mkdirSync(uploadDir);
}

app.use("/uploads",
 express.static(uploadDir)
);

/* ================= FRONTEND ================= */

const FRONTEND_PATH =
 path.join(__dirname,"../frontend");

app.use(express.static(FRONTEND_PATH));

/* ================= API ================= */

app.use("/api/auth",
 require("./routes/auth"));

app.use("/api/news",
 require("./routes/news"));

app.use("/api/users",
 require("./routes/users"));

/* ================= ROUTE FIX ================= */

app.get("*",(req,res)=>{

 if(req.path.startsWith("/api/")){
  return res
   .status(404)
   .json({error:"API not found"});
 }

 const filePath = path.join(
  FRONTEND_PATH,req.path);

 if(fs.existsSync(filePath)){
  return res.sendFile(filePath);
 }

 if(req.path==="/"||req.path===""){
  return res.sendFile(
   path.join(
    FRONTEND_PATH,"index.html"
   )
  );
 }

 res.status(404)
  .send("404 Page not found");
});

/* ================= START ================= */

const PORT =
 process.env.PORT || 3000;

app.listen(PORT,()=>{

 console.log(`
🚀 MediaBuzz365 Server Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Frontend: http://localhost:${PORT}
🔐 Admin:    /admin/login.html
👑 Super:    /superadmin/login.html
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 `);
});
