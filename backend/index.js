const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const attackSchema = new mongoose.Schema({
  type: { type: String, required: true },
  intensity: { type: String, required: true },
  duration: { type: String, required: false, default: null },
  invalidating: { type: String, required: false, default: null },
  medication: { type: String, required: false, default: null },
  menstruation: { type: String, required: false, default: null },
  date: { type: Date, default: Date.now },
});

const Attack = mongoose.model("Attack", attackSchema);

// New Attacks Route
app.get("/api/attacks", async (req, res) => {
  try {
    const attacks = await Attack.find();
    res.status(200).json(attacks);
  } catch (err) {
    res.status(500).json({ message: err.message || "Unknown error" });
  }
});

// Create new Attack
app.post("/api/attacks", async (req, res) => {
  try {
    const {
      type,
      intensity,
      duration,
      medication,
      invalidating,
      menstruation,
      date,
    } = req.body;

    // Only mandatory
    if (!type || !intensity) {
      return res
        .status(400)
        .json({ message: "Type and Intensity are required" });
    }

    // N/A if not mandatory
    const newAttack = new Attack({
      type,
      intensity,
      duration: duration || "N/A",
      medication: medication || "N/A",
      invalidating: invalidating || "N/A",
      menstruation: menstruation || "N/A",
      date: date ? new Date(date) : Date.now(),
    });

    const savedAttack = await newAttack.save();
    res.status(201).json(savedAttack);
  } catch (error) {
    console.error("Error saving attack:", error);
    res.status(500).json({ message: "Server error saving attack" });
  }
});

// Start server locally for development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
