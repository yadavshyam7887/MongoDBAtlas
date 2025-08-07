// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// ✅ MongoDB connection string (encoded @ as %40)
const MONGO_URI = "mongodb+srv://shyamjiyadav069:shyam7887@cluster0.khaq6hh.mongodb.net/studentDB?retryWrites=true&w=majority&appName=Cluster0";

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 20000, // wait 20s before timeout
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Create Schema and Model inside this file
const userSchema = new mongoose.Schema({
  roll_no: String,
  name: String,
  age: Number,
  address: String,
  pin_code: String,
  degree: String,
});
const User = mongoose.model("User", userSchema);

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve HTML & JS

// ✅ API to save form data
app.post("/submit", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({ message: "🎉 Data saved to MongoDB!" });
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// ✅ Serve index.html when root is accessed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
