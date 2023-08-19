const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rooms',
    required: [true, 'Room id is required field']
  },
  
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },

  email:
  {
    type: String,
    required: true
  },
  phoneNumber:
  {
    type: Number,
    required: true
  },
  nationality:
  {
    type: String,
    required: true
  },
  checkIn:
  {
    type: Date,
    required: true
  },
  checkOut:
  {
    type: Date,
    required: true
  },
  noOfPerson:
  {
    type: Number,
    required: true
  },
  booking_status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Cancelled', 'Approved'],
    required: [true, 'Category name is required field.']
  },
  arrivalTime: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
