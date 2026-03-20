const { connectDB } = require("../config/db");
const Product = require("../models/Product");
require("dotenv").config();

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  await connectDB(mongoUri);

  const products = [
    { name: "Wireless Headphones", price: 129.99, category: "Electronics" },
    { name: "Smart Watch", price: 89.5, category: "Electronics" },
    { name: "Graphic T-Shirt", price: 19.99, category: "Fashion" },
    { name: "Sneakers", price: 59.99, category: "Fashion" },
    { name: "Organic Green Tea", price: 12.49, category: "Home" },
    { name: "Programming Book: JS Basics", price: 24.0, category: "Books" },
    { name: "Football (Size 5)", price: 22.99, category: "Sports" },
  ];

  await Product.deleteMany({});
  await Product.insertMany(
    products.map((p) => ({
      ...p,
      image: "",
    }))
  );

  console.log(`Seeded ${products.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

