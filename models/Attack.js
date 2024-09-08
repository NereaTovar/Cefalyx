import mongoose from 'mongoose';

// Definir el esquema para el ataque
const attackSchema = new mongoose.Schema({
  type: { type: String, required: true },
  intensity: { type: String, required: true },
  duration: { type: String },
  invalidating: { type: Boolean, required: true },
  medication: { type: Boolean, required: true },
  menstruation: { type: Boolean, required: true },
  date: { type: Date, default: Date.now },
});

// Crear el modelo basado en el esquema
const Attack = mongoose.model('Attack', attackSchema);

export default Attack;
