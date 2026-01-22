const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    addToWishlist,
    removeFromWishlist,
    getWishlist
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.route('/').get(protect, getWishlist);
router.route('/:propertyId').post(protect, addToWishlist);
router.route('/:propertyId').delete(protect, removeFromWishlist);

module.exports = router;
