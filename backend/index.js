const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Import CORS
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

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

// Definición del esquema del ataque y las rutas para las solicitudes
const attackSchema = new mongoose.Schema({
  type: { type: String, required: true },
  intensity: { type: String, required: true },
  duration: { type: String },
  invalidating: { type: Boolean },
  medication: { type: String },
  menstruation: { type: Boolean },
  date: { type: Date, default: Date.now },
});

const Attack = mongoose.model("Attack", attackSchema);

// Ruta para obtener todos los ataques
app.get("/api/attacks", async (req, res) => {
  try {
    const attacks = await Attack.find();
    res.status(200).json(attacks);
  } catch (err) {
    res.status(500).json({ message: err.message || "Unknown error" });
  }
});

// Ruta para crear un nuevo ataque
app.post("/api/attacks", async (req, res) => {
  const attackData = new Attack(req.body);
  try {
    const savedAttack = await attackData.save();
    res.status(201).json(savedAttack);
  } catch (err) {
    res.status(500).json({ message: err.message || "Unknown error" });
  }
});

// Start server locally for development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
