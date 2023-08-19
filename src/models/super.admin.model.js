const mongoose = require('mongoose');


const superAdminSchema = new mongoose.Schema({

  userName: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "A unique email is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  resetToken: String,
  resetTokenExpiry: Date,
});

const Admin = mongoose.model('Admin', superAdminSchema);

module.exports = Admin;

