const mongoose = require('mongoose');
const Review = require('../models/Review');
const Property = require('../models/Property');
const AppError = require('../utils/AppError');

// Add Review
exports.addReview = async (req, res, next) => {
    try {
        const { propertyId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
            return next(new AppError('Invalid property ID', 400));
        }

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        // One user can now give multiple reviews per property if they wish
        // (Removed restriction to allow for flexible testing and multiple reviews)

        const review = await Review.create({
            userId,
            propertyId,
            rating,
            comment
        });

        // Update Property Rating
        const reviews = await Review.find({ propertyId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        await Property.findByIdAndUpdate(propertyId, {
            rating: avgRating,
            numReviews: numReviews
        });

        res.status(201).json({
            success: true,
            data: { review }
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(new AppError('You have already reviewed this property', 400));
        }
        next(err);
    }
};

// Get Reviews for a Property
exports.getPropertyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ propertyId: req.params.propertyId })
            .populate('userId', 'username profilePicture')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            results: reviews.length,
            data: { reviews }
        });
    } catch (err) {
        next(err);
    }
};

// Delete Review (Optional, but good for completeness)
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return next(new AppError('Review not found', 404));

        if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const propertyId = review.propertyId;
        await review.deleteOne();

        // Update Property Rating
        const reviews = await Review.find({ propertyId });
        const numReviews = reviews.length;
        const avgRating = numReviews > 0
            ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews
            : 0;

        await Property.findByIdAndUpdate(propertyId, {
            rating: avgRating,
            numReviews: numReviews
        });

        res.status(204).json({
            success: true,
            data: null
        });
    } catch (err) {
        next(err);
    }
};
