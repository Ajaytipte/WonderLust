const Booking = require('../models/Booking');
const Property = require('../models/Property');
const AppError = require('../utils/AppError');

exports.createBooking = async (req, res, next) => {
    try {
        const { propertyId, startDate, endDate } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return next(new AppError('End date must be after start date', 400));
        }

        // Check for overlaps
        const existingBooking = await Booking.findOne({
            propertyId,
            status: { $ne: 'cancelled' },
            $or: [
                {
                    startDate: { $lt: end },
                    endDate: { $gt: start }
                }
            ]
        });

        if (existingBooking) {
            return next(new AppError('Property is already booked for these dates', 400));
        }

        // Calculate Price
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * property.pricePerNight;

        const newBooking = await Booking.create({
            propertyId,
            userId: req.user.id,
            startDate: start,
            endDate: end,
            totalPrice,
            status: 'confirmed' // Auto-confirm for now (Phase 1)
        });

        res.status(201).json({
            success: true,
            data: { booking: newBooking }
        });
    } catch (err) {
        next(err);
    }
};

exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('propertyId', 'title photos location pricePerNight')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            results: bookings.length,
            data: { bookings }
        });
    } catch (err) {
        next(err);
    }
};

// Get single booking by ID
exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('propertyId')
            .populate('userId', 'username email');

        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        // Check if user owns this booking or is host/admin
        const property = booking.propertyId;
        const isOwner = booking.userId._id.toString() === req.user.id;
        const isHost = property && property.hostId.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isHost && !isAdmin) {
            return next(new AppError('You do not have permission to view this booking', 403));
        }

        res.status(200).json({
            success: true,
            data: { booking }
        });
    } catch (err) {
        next(err);
    }
};

// For Hosts: Get bookings for their properties
exports.getHostBookings = async (req, res, next) => {
    try {
        // 1. Find all properties owned by this host
        const properties = await Property.find({ hostId: req.user.id });
        const propertyIds = properties.map(p => p._id);

        // 2. Find bookings for these properties
        const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
            .populate('userId', 'username email profilePicture')
            .populate('propertyId', 'title')
            .sort('-startDate');

        res.status(200).json({
            success: true,
            results: bookings.length,
            data: { bookings }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return next(new AppError('No booking found', 404));

        // Only allow user who made it or host/admin to cancel
        // We need to fetch property to check host
        const property = await Property.findById(booking.propertyId);

        const isOwner = booking.userId.toString() === req.user.id;
        let isHost = false;
        if (property) {
            isHost = property.hostId.toString() === req.user.id;
        }
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return next(new AppError('Only the person who booked this can cancel it', 403));
        }

        await booking.deleteOne();
        res.status(204).json({
            success: true,
            data: null
        });
    } catch (err) {
        next(err);
    }
};
