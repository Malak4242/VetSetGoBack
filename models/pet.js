// models/pet.js
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "Dog", "Cat"
  breed: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female'] },
  notes: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  img: { type: String }, // <-- Add this line
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', PetSchema);