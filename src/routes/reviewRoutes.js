const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create a new review for a hotel
router.post('/:hotelId/reviews', reviewController.createReview);

// Update a review for a hotel
router.put('/update/:reviewId', reviewController.updateReview);

// Delete a review for a hotel
router.delete('/delete/:reviewId', reviewController.deleteReview);

// Get the all reviews 
router.get('/viewAll/reviews', reviewController.getAllReviews);

// Get the reviews by id
router.get('/reviewById/:reviewId', reviewController.getReviewById);

// Get top rated hotels
router.get('/hotels/top-rated', reviewController.getTopRatedHotels);

module.exports = router;
