// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Mongo URI (use .env) ----
// Create a .env file with: MONGO_URI="your-atlas-uri"
const MONGO_URI =
  "mongodb+srv://shyamjiyadav069:shyam7887@cluster0.khaq6hh.mongodb.net/studentDB?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Set it in your .env file.");
  process.exit(1);
}

// ---- Middleware ----
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "https://your-frontend-domain.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Serve static files from /public (index.html, script.js, etc.)
app.use(express.static(path.join(__dirname, "public")));

// ---- DB Schema/Model ----
const userSchema = new mongoose.Schema(
  {
    roll_no: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    age: { type: Number, min: 0, max: 150 },
    address: { type: String, trim: true },
    pin_code: { type: String, trim: true },
    degree: { type: String, trim: true },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

// ---- Routes ----

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// IMPORTANT: route now matches the client ("/api/submit")
app.post("/api/submit", async (req, res) => {
  try {
    const payload = req.body || {};

    // Basic validation
    if (!payload.roll_no || !payload.name) {
      return res.status(400).json({ error: "roll_no and name are required" });
    }

    // Ensure age is a number if provided
    if (payload.age !== undefined) {
      const parsed = Number(payload.age);
      if (Number.isNaN(parsed)) {
        return res.status(400).json({ error: "age must be a number" });
      }
      payload.age = parsed;
    }

    const doc = await User.create(payload);
    return res.status(201).json({ message: "🎉 Data saved to MongoDB!", id: doc._id });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    return res.status(500).json({ error: "Failed to save data" });
  }
});

// Serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---- Start server after DB connects ----
async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

start();
