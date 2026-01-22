const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        state: String,
        country: { type: String, required: true }
    },
    category: {
        type: String,
        enum: ['adventure', 'cultural', 'food', 'wellness', 'nature', 'workshop', 'other'],
        required: true
    },
    duration: { type: Number, required: true }, // in hours
    pricePerPerson: { type: Number, required: true },
    maxParticipants: { type: Number, required: true },
    photos: [{ type: String }],
    includes: [{ type: String }], // What's included in the experience
    requirements: { type: String, default: '' }, // Age limits, skill level, etc.
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
