const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  fileName: String,
});

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  roomType: {
    type: String,
    required: true,
  },
  roomSize: {
    type: Number,
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
  },
  occupancy: {
    type: Number,
    required: true,
  },
  bedTypes: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  roomView: {
    type: String,
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  bookingPolicy: {
    type: String,
    required: true,
  },
  pictures: {
    type: [pictureSchema],
    required: true,
  },
  roomAvailability: {
    type: Boolean,
    default: true,
  },
  checkIn: Date,
  checkOut: Date,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
