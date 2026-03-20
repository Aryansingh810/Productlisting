const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function timestampFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext).replace(/\s+/g, "-");
  return `${Date.now()}_${base}${ext}`;
}

const allowedMime = new Set(["image/jpeg", "image/png"]);
const allowedExt = new Set([".jpg", ".jpeg", ".png"]);

const storage = multer.diskStorage({
  destination: function destination(_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function filename(_req, file, cb) {
    cb(null, timestampFilename(file.originalname));
  },
});

const fileFilter = function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = allowedMime.has(file.mimetype);
  const extOk = allowedExt.has(ext);

  if (mimeOk && extOk) return cb(null, true);
  return cb(new Error("Only JPG/PNG images are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = { upload };

