const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        // One user can now give multiple reviews per property if they wish
        // (Removed restriction to allow for flexible testing and multiple reviews)
        required: [true, 'Review must belong to a property.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Review must have a rating.']
    },
    comment: {
        type: String,
        required: [true, 'Review must have a comment.']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Simplified index for performance (removed unique constraint)
reviewSchema.index({ propertyId: 1, userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
