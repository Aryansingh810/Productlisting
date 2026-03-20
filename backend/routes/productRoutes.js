const express = require("express");
const { getProducts, addProduct } = require("../controllers/productController");
const { upload } = require("../middleware/upload");

const router = express.Router();

// GET /api/products?category=&minPrice=&maxPrice=&sort=&search=
router.get("/products", getProducts);

// POST /api/products (multipart/form-data: image)
router.post("/products", upload.single("image"), addProduct);

module.exports = router;

