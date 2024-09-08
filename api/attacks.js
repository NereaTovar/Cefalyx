import mongoose from "mongoose";
import Attack from "../models/Attack";

// Conectar a MongoDB solo una vez
if (!mongoose.connections[0].readyState) {
  const mongoUri = process.env.MONGO_URI; // Asegúrate de que MONGO_URI esté configurado
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const attacks = await Attack.find();
      res.status(200).json(attacks);
    } catch (err) {
      res.status(500).json({ message: err.message || "Unknown error" });
    }
  } else if (req.method === "POST") {
    try {
      const attackData = new Attack(req.body);
      const savedAttack = await attackData.save();
      res.status(201).json(savedAttack);
    } catch (err) {
      res.status(500).json({ message: err.message || "Unknown error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
