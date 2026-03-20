const Product = require("../models/Product");

function toNumberOrUndefined(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  // Avoid NaN
  return Number.isFinite(n) ? n : undefined;
}

async function getProducts(req, res) {
  try {
    const { category, minPrice, maxPrice, sort, search } = req.query;

    const filter = {};
    if (category && String(category).trim() !== "" && String(category) !== "All") {
      filter.category = String(category).trim();
    }

    const min = toNumberOrUndefined(minPrice);
    const max = toNumberOrUndefined(maxPrice);
    if (min !== undefined || max !== undefined) {
      filter.price = {};
      if (min !== undefined) filter.price.$gte = min;
      if (max !== undefined) filter.price.$lte = max;
    }

    if (search && String(search).trim() !== "") {
      filter.name = { $regex: String(search).trim(), $options: "i" };
    }

    const sortObj = {};
    if (sort === "asc") sortObj.price = 1;
    if (sort === "desc") sortObj.price = -1;

    let query = Product.find(filter);
    if (Object.keys(sortObj).length) query = query.sort(sortObj);

    const products = await query.lean();

    res.json({ products });
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Failed to fetch products." });
  }
}

async function addProduct(req, res) {
  try {
    const { name, price, category } = req.body;
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required. Accepted types: jpg, jpeg, png (max 2MB).",
      });
    }

    if (!name || !category || price === undefined || price === "") {
      return res.status(400).json({
        message: "Please provide 'name', 'price', 'category', and an image file.",
      });
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Invalid 'price' value." });
    }

    // Store URL path in DB (frontend can render: `${API_URL}${image}`)
    const image = `/uploads/${req.file.filename}`;

    const product = await Product.create({
      name: String(name).trim(),
      price: numericPrice,
      category: String(category).trim(),
      image,
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error("addProduct error:", err);
    res.status(500).json({ message: "Failed to add product." });
  }
}

module.exports = { getProducts, addProduct };

