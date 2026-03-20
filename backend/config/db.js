const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error("Missing MongoDB connection string (MONGODB_URI).");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);

  const dbName = mongoose.connection?.db?.databaseName;
  console.log("MongoDB connected successfully.");
  console.log("Connected database:", dbName || "(unknown)");

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  return mongoose.connection;
}

module.exports = { connectDB };

