import mongoose from 'mongoose';
import Attack from '../../models/Attack'; // Asegúrate de tener el modelo en una ruta correcta

const mongoUri = 'mongodb+srv://cefalyx_admin:Cefalyx2024@cefalyx.x6qwy.mongodb.net/cefalyx?retryWrites=true&w=majority&appName=Cefalyx';

mongoose.connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const attacks = await Attack.find();
      res.status(200).json(attacks);
    } catch (err) {
      res.status(500).json({ message: err.message || "Unknown error" });
    }
  } else if (req.method === 'POST') {
    const attackData = new Attack(req.body);

    try {
      const savedAttack = await attackData.save();
      res.status(200).json(savedAttack);
    } catch (err) {
      res.status(500).json({ message: err.message || "Unknown error" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
