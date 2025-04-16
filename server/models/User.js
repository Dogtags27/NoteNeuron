const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  visible_sheets: {
  type: [String], // array of sheet_id strings
  default: [],
},
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
