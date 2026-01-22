const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        address: String,
        city: { type: String, required: true },
        state: String,
        country: { type: String, required: true },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    pricePerNight: { type: Number, required: true },
    photos: [{ type: String }],
    amenities: [{ type: String }],
    maxGuests: { type: Number, required: true },
    type: {
        type: String,
        enum: ['apartment', 'house', 'villa', 'cabin', 'hotel', 'other'],
        required: true
    },
    rules: { type: String, default: '' },
    ownerOffers: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
