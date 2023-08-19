const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  fileName: String,
});

const hotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
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
  // tc: {
  //   type: Boolean,
  //   required: true
  // },
  hotelAddress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  // cnic: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   minlength: 13,
  //   maxlength: 13,
  // },

  pictures: {
    type: [pictureSchema],
    required: true,
  },
  
  // latitude: {
  //   type: Number,
  //   required: true,
  // },
  // longitude: {
  //   type: Number,
  //   required: true,
  // },

  enabled: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },

  resetToken: String,
  resetTokenExpiry: Date,
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;

