const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
require("dotenv").config();

const { connectDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", productRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Error handler (including Multer)
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: err.message || "Upload error." });
  }

  if (
    err &&
    err.message &&
    (err.message.toLowerCase().includes("jpg") ||
      err.message.toLowerCase().includes("png") ||
      err.message.toLowerCase().includes("only"))
  ) {
    return res.status(400).json({ message: err.message });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

async function start() {
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`ProductHub API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

