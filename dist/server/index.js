import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Middleware para análisis del cuerpo de las solicitudes
app.use(bodyParser.json());

// Configuración de CORS para múltiples orígenes
const corsOptions = {
  origin: [
    "https://cefalyx-o9te2x519-nereas-projects-2a045b48.vercel.app",
    "https://cefalyx-aic7c1dbc-nereas-projects-2a045b48.vercel.app",
    "http://localhost:5173",
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Verificar cabeceras (opcional si ya usas cors middleware)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Manejar solicitudes pre-flight (opcional)
app.options("*", cors(corsOptions));


const mongoUri = process.env.MONGO_URI || "mongodb+srv://cefalyx_admin:Cefalyx2024@cefalyx.x6qwy.mongodb.net/cefalyx?retryWrites=true&w=majority&appName=Cefalyx";
// Conexión a MongoDB
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Rutas
app.get("/", (req, res) => {
  res.send("API Running");
});

// Definición del esquema del ataque y las rutas para las solicitudes
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
  const attackData = new Attack(req.body);
  try {
    const savedAttack = await attackData.save();
    res.status(201).json(savedAttack);
  } catch (err) {
    res.status(500).json({ message: err.message || "Unknown error" });
  }
});

// Ruta para obtener todos los ataques
app.get("/api/attacks", async (req, res) => {
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


mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB at URI:", mongoUri);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

