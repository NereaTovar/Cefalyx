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
  duration: { type: String, required: false, default: null }, // Opcional con valor por defecto
  invalidating: { type: Boolean, required: false, default: false }, // Opcional con valor por defecto
  medication: { type: String, required: false, default: null }, // Opcional con valor por defecto
  menstruation: { type: Boolean, required: false, default: false }, // Opcional con valor por defecto
  date: { type: Date, default: Date.now }, // Fecha por defecto
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

    // Verificar que solo los campos obligatorios están presentes
    if (!type || !intensity) {
      return res
        .status(400)
        .json({ message: "Type and Intensity are required" });
    }

    // Crear un nuevo ataque, utilizando valores predeterminados si ciertos campos no están presentes
    const newAttack = new Attack({
      type,
      intensity,
      duration: duration || null, // Si no está definido, asignar null
      medication: medication || null, // Si no está definido, asignar null
      invalidating: invalidating || false, // Si no está definido, asignar false
      menstruation: menstruation || false, // Si no está definido, asignar false
      date: date ? new Date(date) : Date.now(), // Si no está definida la fecha, usar la fecha actual
    });

    const savedAttack = await newAttack.save();
    res.status(201).json(savedAttack); // Respuesta de éxito
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
