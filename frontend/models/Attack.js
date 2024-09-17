import mongoose from 'mongoose';


const attackSchema = new mongoose.Schema({
  type: { type: String, required: true },
  intensity: { type: String, required: true },
  duration: { type: String },
  invalidating: { type: Boolean, required: true },
  medication: { type: Boolean, required: true },
  menstruation: { type: Boolean, required: true },
  date: { type: Date, default: Date.now },
});


const Attack = mongoose.model('Attack', attackSchema);

export default Attack;
