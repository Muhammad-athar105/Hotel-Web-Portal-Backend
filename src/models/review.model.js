const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  // reservationId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Reservation',
  //   required: true
  // },

  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  name: {
    type: String
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
