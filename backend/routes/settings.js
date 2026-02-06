const router = require("express").Router();
const Settings = require("../models/Settings");

/* GET YOUTUBE LINK */
router.get("/youtube", async(req, res) => {
 try {
  console.log("📥 GET /api/settings/youtube - Request received");

  let settings = await Settings.findOne();
  console.log("📊 Current settings in DB:", settings);

  if(!settings) {
   console.log("⚠️ No settings found, creating new one...");
   settings = await Settings.create({ youtubeLink: "" });
  }

  const linkToReturn = settings.youtubeLink || "";
  console.log("✅ Returning link:", linkToReturn);

  res.json(linkToReturn);
 } catch(err) {
  console.error("❌ Error getting YouTube link:", err);
  res.status(500).json({ msg: "Error fetching YouTube link", error: err.message });
 }
});

/* UPDATE YOUTUBE LINK */
router.post("/youtube", async(req, res) => {
 try {
  console.log("📥 POST /api/settings/youtube - Request received");
  console.log("📦 Request body:", req.body);

  const { link } = req.body;

  console.log("🔗 Link from body:", link);
  console.log("🔍 Link type:", typeof link);

  if(!link || typeof link !== 'string') {
   console.log("❌ Validation failed: Invalid link");
   return res.status(400).json({ msg: "Valid YouTube link required" });
  }

  // Validate YouTube URL format
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  if(!youtubeRegex.test(link.trim())) {
   console.log("❌ Validation failed: Invalid YouTube URL format");
   return res.status(400).json({ msg: "Invalid YouTube URL format" });
  }

  console.log("✅ Validation passed");

  let settings = await Settings.findOne();
  console.log("📊 Current settings:", settings);

  if(!settings) {
   console.log("⚠️ No settings found, creating new one...");
   settings = await Settings.create({ youtubeLink: link.trim() });
   console.log("✅ New settings created:", settings);
  } else {
   console.log("📝 Updating existing settings...");
   settings.youtubeLink = link.trim();
   await settings.save();
   console.log("✅ Settings updated:", settings);
  }

  res.json({
   msg: "YouTube link updated successfully",
   link: settings.youtubeLink
  });
 } catch(err) {
  console.error("❌ Error updating YouTube link:", err);
  console.error("Error stack:", err.stack);
  res.status(500).json({ msg: "Error updating YouTube link", error: err.message });
 }
});

module.exports = router;