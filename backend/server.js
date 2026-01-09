const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");

const ADMIN_PASSWORD = "admin123";
const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));


// ================= ADMIN PAGES =================

// Admin Login Page
app.get("/admin/login", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/admin-login.html")
  );
});

// Admin Dashboard Page
app.get("/admin", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/admin-dashboard.html")
  );
});


/* ================= PATHS ================= */

const DATA_DIR = path.join(__dirname, "data");
const NEWS_FILE = path.join(DATA_DIR, "news.json");
const LIVE_FILE = path.join(DATA_DIR, "live.json");

/* ================= ENSURE FILES ================= */

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

if (!fs.existsSync(NEWS_FILE)) fs.writeFileSync(NEWS_FILE, "[]");
if (!fs.existsSync(LIVE_FILE))
  fs.writeFileSync(LIVE_FILE, JSON.stringify({ liveId: "" }, null, 2));

/* ================= HELPERS ================= */

const readNews = () =>
  JSON.parse(fs.readFileSync(NEWS_FILE, "utf-8"));

const writeNews = data =>
  fs.writeFileSync(NEWS_FILE, JSON.stringify(data, null, 2));

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

/* ================= ADMIN LOGIN ================= */

app.post("/api/admin/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD)
    return res.json({ success: true });

  res.status(401).json({ success: false });
});

/* ================= ADD NEWS ================= */

app.post("/api/admin/news", upload.single("imageFile"), (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Unauthorized" });

  const news = readNews();

  const image = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.imageUrl || "";

  news.push({
    id: Date.now(),
    state: req.body.state || "",
    city: req.body.city || "",
    category: req.body.category || "",
    title: req.body.title,
    description: req.body.description || "",
    image,
    liveId: req.body.liveId || "",
    date: new Date().toISOString()
  });

  writeNews(news);
  res.json({ message: "✅ News Added Successfully" });
});

/* ================= EDIT NEWS ================= */

app.put("/api/admin/news/:id", (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Unauthorized" });

  let news = readNews();
  news = news.map(n =>
    n.id == req.params.id ? { ...n, ...req.body } : n
  );

  writeNews(news);
  res.json({ message: "✏️ News Updated" });
});

/* ================= DELETE NEWS ================= */

app.delete("/api/admin/news/:id", (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Unauthorized" });

  let data = JSON.parse(fs.readFileSync(NEWS_FILE));
  data = data.filter(n => n.id != req.params.id);
  fs.writeFileSync(NEWS_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Deleted" });
});

/* ================= PUBLIC NEWS ================= */

app.get("/api/news/breaking", (req, res) => {
  const data = readNews();
  const breaking = data
    .slice(-5)
    .reverse()
    .map(n => ({
      title: n.title,
      description: n.description || "",
      date: n.date
    }));
  res.json(breaking);
});

app.get("/api/news/city/:city", (req, res) => {
  const data = readNews();
  const cityNews = data.filter(
    n => n.city?.toLowerCase() === req.params.city.toLowerCase()
  );
  res.json(cityNews);
});

app.get("/api/news/state/:state", (req, res) => {
  const state = req.params.state.toLowerCase();
  const news = readNews().filter(
    n => n.state?.toLowerCase() === state
  );
  res.json(news);
});

app.get("/api/news", (req, res) => {
  let news = readNews();

  const { city, state, category } = req.query;

  if (state) {
    news = news.filter(
      n => n.state?.toLowerCase() === state.toLowerCase()
    );
  }

  if (city) {
    news = news.filter(
      n => n.city?.toLowerCase() === city.toLowerCase()
    );
  }

  if (category) {
    news = news.filter(
      n => n.category?.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(news);
});


app.get("/api/news/breaking/today", (req, res) => {
  const news = readNews();
  const breaking = news
    .slice(-6)
    .reverse()
    .map(n => ({
      title: n.title,
      description: n.description || "",
      date: n.date
    }));
  res.json(breaking);
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`🚀 Server running → http://localhost:${PORT}`)
);
