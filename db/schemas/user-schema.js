const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [emailRegex, 'Por favor, introduzca un email válido']
  },
  password: {
    type: String,
    required: true
  }
}, 
{
  timestamps: true  // Add createdAt and updatedAt
});

// Model
const User = mongoose.model('User', UserSchema);

module.exports = User;
