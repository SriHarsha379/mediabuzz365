require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

/* STATIC */
app.use("/uploads", express.static(path.join(__dirname,"uploads")));
app.use(express.static(path.join(__dirname,"../frontend")));

/* TEST */
app.get("/health",(req,res)=>{
 res.json({status:"OK"});
});

/* START */
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
 console.log(`🚀 Server running on ${PORT}`);
});
