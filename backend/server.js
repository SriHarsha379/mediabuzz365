require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= STATIC FILES ================= */

// uploads
app.use("/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// frontend files
const FRONTEND_PATH = path.join(__dirname, "../frontend");
app.use(express.static(FRONTEND_PATH));

/* ================= API ROUTES ================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/news", require("./routes/news"));
app.use("/api/users", require("./routes/users"));

/* ================= ROUTING FIX ================= */

app.get("*", (req, res) => {

  // protect APIs
  if (req.path.startsWith("/api/")) {
    return res
      .status(404)
      .json({ error: "API endpoint not found" });
  }

  const filePath = path.join(
    FRONTEND_PATH,
    req.path
  );

  // serve file if exists
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // only fallback to home if root
  if (req.path === "/" || req.path === "") {
    return res.sendFile(
      path.join(FRONTEND_PATH, "index.html")
    );
  }

  // real 404
  res.status(404).send("404 Page not found");
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 MediaBuzz365 Server Running!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🌐 Frontend:          http://localhost:${PORT}`);
  console.log(`🔐 Admin Login:       http://localhost:${PORT}/admin/login.html`);
  console.log(`⚙️  Admin Dashboard:  http://localhost:${PORT}/admin/index.html`);
  console.log(`👑 Super Admin:       http://localhost:${PORT}/superadmin/login.html`);
  console.log(`📰 Alternative Admin: http://localhost:${PORT}/admin-dashboard.html`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

