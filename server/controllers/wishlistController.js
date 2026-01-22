const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Add property to wishlist
// @route   POST /api/wishlist/:propertyId
// @access  Private
exports.addToWishlist = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user._id;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Use $addToSet to add only if it doesn't exist (atomic)
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: propertyId } },
            { new: true }
        );

        res.status(200).json({
            message: 'Property added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove property from wishlist
// @route   DELETE /api/wishlist/:propertyId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user._id;

        // Use $pull to remove from array (atomic)
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: propertyId } },
            { new: true }
        );

        res.status(200).json({
            message: 'Property removed from wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user's wishlist with property details
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: 'wishlist',
            select: 'title description location pricePerNight photos type rating numReviews'
        });

        // Filter out any potential nulls (in case properties were deleted)
        const wishlist = (user.wishlist || []).filter(item => item !== null);
        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
