import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware para análisis del cuerpo de las solicitudes
app.use(bodyParser.json());

// Configuración de CORS
app.use(
  cors({
    origin: "https://cefalyx-2xns9fds8-nereas-projects-2a045b48.vercel.app/",
    methods: "GET, POST, PUT, DELETE", // Métodos HTTP permitidos
    credentials: true, // Habilitar credenciales si es necesario
  })
);

// Verificar cabeceras
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Manejar solicitudes pre-flight
app.options("*", cors());

// Conexión a MongoDB
const mongoUri =
  "mongodb+srv://cefalyx_admin:Cefalyx2024@cefalyx.x6qwy.mongodb.net/cefalyx?retryWrites=true&w=majority&appName=Cefalyx";
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Definición del esquema del ataque
const attackSchema = new mongoose.Schema({
  type: { type: String, required: true },
  intensity: { type: String, required: true },
  duration: { type: String },
  invalidating: { type: Boolean, required: true },
  medication: { type: Boolean, required: true },
  menstruation: { type: Boolean, required: true },
  date: { type: Date, default: Date.now },
});

const Attack = mongoose.model("Attack", attackSchema);

// Ruta para crear un nuevo ataque
app.post("/api/attacks", async (req, res) => {
  console.log("Received request to create an attack"); // Log para depuración
  const attackData = new Attack({
    ...req.body,
    invalidating: req.body.invalidating === "yes", // Asegura que los valores booleanos sean correctos
    medication: req.body.medication === "yes",
    menstruation: req.body.menstruation === "yes",
  });

  try {
    const savedAttack = await attackData.save();
    res.status(200).json(savedAttack);
  } catch (err) {
    res.status(500).json({ message: err.message || "Unknown error" });
  }
});

// Ruta para obtener todos los ataques
app.get("/api/attacks", async (req, res) => {
  console.log("Received request at /api/attacks"); // Log para depuración
  try {
    const attacks = await Attack.find();
    res.status(200).json(attacks);
  } catch (err) {
    res.status(500).json({ message: err.message || "Unknown error" });
  }
});

// Iniciar el servidor
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
