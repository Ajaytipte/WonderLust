const express = require('express');
const {
    addReview,
    getPropertyReviews,
    deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getPropertyReviews)
    .post(protect, addReview);

router.route('/:id')
    .delete(protect, deleteReview);

module.exports = router;
