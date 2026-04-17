require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

connectDB();

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO SERVER ================= */

const io = new Server(server,{
 cors:{
  origin:true,
  credentials:true
 }
});

// make io global
app.set("io", io);

io.on("connection",(socket)=>{
 console.log("🟢 Socket connected:", socket.id);

 socket.on("join",(room)=>{
  socket.join(room);
  console.log("Joined:",room);
 });

 socket.on("join-admin",(id)=>{
  socket.join(`admin:${id}`);
 });

 socket.on("join-super",()=>{
  socket.join("super-admin");
 });

 socket.on("join-public",()=>{
  socket.join("public");
 });

 socket.on("disconnect",()=>{
  console.log("🔴 Socket disconnected:", socket.id);
 });
});

/* ================= MIDDLEWARE ================= */

app.use(cors({
 origin:true,
 credentials:true
}));

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true}));

/* ================= RATE LIMITING ================= */

const publicNewsLimiter = rateLimit({
 windowMs: 60 * 1000, // 1 minute
 max: 60,             // 60 requests per minute per IP
 standardHeaders: true,
 legacyHeaders: false,
 message: { error: "Too many requests, please try again later." }
});

/* ================= SOCKET CLIENT FIX ================= */
/* THIS IS THE MAIN FIX */

app.use(
 "/socket.io",
 express.static(
  path.join(__dirname,"node_modules/socket.io/client-dist")
 )
);

/* ================= ROUTES ================= */

app.use("/api/auth",require("./routes/auth"));
app.use("/api/news", publicNewsLimiter, require("./routes/news"));
app.use("/api/users",require("./routes/users"));
app.use("/api/settings",require("./routes/settings"));

/* ================= UPLOADS ================= */

const uploadDir = path.join(__dirname,"uploads");
if(!fs.existsSync(uploadDir)){
 fs.mkdirSync(uploadDir,{recursive:true});
}
app.use("/uploads",express.static(uploadDir));

/* ================= FRONTEND ================= */

const FRONTEND_PATH = path.join(__dirname,"../frontend");
app.use(express.static(FRONTEND_PATH));

/* ================= HEALTH ================= */

app.get("/health",(req,res)=>{
 res.json({
  status:"OK",
  sockets:io.engine.clientsCount
 });
});

/* ================= SPA ================= */

app.get("*",(req,res)=>{
 if(req.path.startsWith("/api")){
  return res.status(404).json({error:"API not found"});
 }
 res.sendFile(path.join(FRONTEND_PATH,"index.html"));
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
 console.log(`
🚀 MediaBuzz365 Server Running!
🌐 http://localhost:${PORT}
🔐 Admin: /admin/login.html
👑 Super: /superadmin/login.html
 `);
});
