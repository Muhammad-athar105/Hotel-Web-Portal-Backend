const Hotel = require("../models/hotel.model");
const Review = require("../models/review.model");

// Create a new review for a room
const createReview = async (req, res) => {
  try {
    const { hotelId, hotelName } = req.params;
    const { rating, comment, name } = req.body;

    if (!hotelId) {
      return res.status(400).json({ message: "hotelId is required" });
    }

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const existingReview = await Review.findOne({ hotelId, name });

    if (existingReview) {
      return res.status(400).json({ message: "You already gave a review" });
    }

    const review = new Review({
      hotelId,
      hotelName,
      rating,
      name,
      comment,
    });

    await review.save();

    // Calculate new average rating for the hotel
    const reviews = await Review.find({ hotelId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    hotel.rating = totalRating / reviews.length;
    await hotel.save();

    // Populate the hotelName field in the review document
    const populatedReview = await Review.findById(review._id).populate(
      "hotelId",
      "hotelName"
    );

    // Return the hotelName in the response
    const reviewWithHotelName = {
      _id: populatedReview._id,
      hotelName: populatedReview.hotelId.hotelName, 
      rating: populatedReview.rating,
      name: populatedReview.name,
      comment: populatedReview.comment,
    };

    res.status(201).json(reviewWithHotelName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    reviews.sort((a, b) => b.rating - a.rating);
    const topTenReviews = reviews.slice(0, 10);

    res.status(200).json(topTenReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get To Rated Hotels
const getTopRatedHotels = async (req, res) => {
  try {
    const hotels = await Review.find()
      .sort({ rating: -1 })
      .limit(10)
      .populate('hotelId');

    res.status(200).json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get a review by ID
const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).populate("hotelId");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a review for a room
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review successfully updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a review for a room
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.deleteOne({ _id: reviewId });

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAllReviews, getReviewById, createReview, updateReview, deleteReview, getTopRatedHotels };
