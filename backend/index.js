const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { ObjectId } = mongoose.Types;
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Configurar CORS para permitir solicitudes desde `localhost:5173`
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cefalyx-nereas-projects-2a045b48.vercel.app",
    ],
    credentials: true, // Esto permite enviar cookies y credenciales
  })
);

// Definición del esquema de ataques
const attackSchema = new mongoose.Schema({
  type: { type: String, required: true },
  intensity: { type: String, required: true },
  duration: { type: String, required: false, default: null },
  invalidating: { type: String, required: false, default: null },
  medication: { type: String, required: false, default: null },
  menstruation: { type: String, required: false, default: null },
  date: { type: Date, default: Date.now },
});

// Definición del modelo Attack
const Attack = mongoose.model("Attack", attackSchema);

// Obtener todos los ataques
app.get("/api/attacks", async (req, res) => {
  try {
    const attacks = await Attack.find();
    res.status(200).json(attacks);
  } catch (err) {
    res.status(500).json({ message: err.message || "Unknown error" });
  }
});

// Crear nuevo ataque
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

    if (!type || !intensity) {
      return res
        .status(400)
        .json({ message: "Type and Intensity are required" });
    }

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

// Eliminar un ataque
app.delete("/api/attacks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el ID es un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid attack ID");
    }

    // Convertir el ID a ObjectId y eliminar
    const deletedAttack = await Attack.findByIdAndDelete(new ObjectId(id));
    if (!deletedAttack) {
      return res.status(404).send("Attack not found");
    }

    res.status(200).send("Attack deleted successfully");
  } catch (err) {
    console.error("Error deleting attack:", err);
    res.status(500).send("Error deleting attack");
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000 || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
