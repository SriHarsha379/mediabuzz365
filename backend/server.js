require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images from backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static frontend files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/news", require("./routes/news"));

// Handle SPA routing - serve index.html for undefined routes
// This should be AFTER all other routes
app.get("*", (req, res) => {
  // Don't interfere with API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  
  // For other routes, try to serve the file or fallback to index.html
  const filePath = path.join(__dirname, "../frontend", req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, "../frontend", "index.html"));
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 MediaBuzz365 Server Running!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🌐 Frontend:          http://localhost:${PORT}`);
  console.log(`🔐 Admin Login:       http://localhost:${PORT}/admin/login.html`);
  console.log(`⚙️  Admin Dashboard:   http://localhost:${PORT}/admin/index.html`);
  console.log(`📰 Alternative Admin: http://localhost:${PORT}/admin-dashboard.html`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});