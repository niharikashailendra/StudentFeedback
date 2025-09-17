// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student','admin'], default: 'student' },
  blocked: { type: Boolean, default: false },
  phone: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null },
  address: { type: String, default: '' },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);