const Property = require('../models/Property');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');

// Get All Properties (with filtering)
exports.getAllProperties = async (req, res, next) => {
    try {
        // Basic Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Search Logic
        if (req.query.search) {
            queryObj.title = { $regex: req.query.search, $options: 'i' };
        }

        // Advanced Filtering (gte, lte, etc.)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Search by text (if 'search' param exists)
        // Note: You might want to handle this differently, e.g., $or on title/location
        let query = Property.find(JSON.parse(queryStr));

        // Execute
        const properties = await query;

        res.status(200).json({
            success: true,
            results: properties.length,
            data: { properties }
        });
    } catch (err) {
        next(err);
    }
};

exports.getProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id).populate('hostId', 'username email');
        if (!property) {
            return next(new AppError('No property found with that ID', 404));
        }
        res.status(200).json({
            success: true,
            data: { property }
        });
    } catch (err) {
        next(err);
    }
};

exports.createProperty = async (req, res, next) => {
    try {
        console.log('📝 Creating new property...');

        // Add current user as host
        req.body.hostId = req.user.id;

        // Parse Location Fields (from FormData flat keys)
        if (!req.body.location) req.body.location = {};
        if (req.body['location[address]']) req.body.location.address = req.body['location[address]'];
        if (req.body['location[city]']) req.body.location.city = req.body['location[city]'];
        if (req.body['location[country]']) req.body.location.country = req.body['location[country]'];
        if (req.body['location[state]']) req.body.location.state = req.body['location[state]'];

        // Handle Image Uploads from Cloudinary
        // CRITICAL: multer-storage-cloudinary automatically uploads to Cloudinary
        // file.path contains the Cloudinary secure_url (e.g., https://res.cloudinary.com/...)
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => file.path); // Already Cloudinary URLs
            console.log(`✅ Uploaded ${req.files.length} images to Cloudinary:`, req.body.photos);
        }

        // Parse Amenities (if sent as flat keys like amenities[0])
        if (!req.body.amenities) {
            const amenities = [];
            Object.keys(req.body).forEach(key => {
                if (key.startsWith('amenities[')) {
                    amenities.push(req.body[key]);
                }
            });
            if (amenities.length > 0) req.body.amenities = amenities;
        }

        const newProperty = await Property.create(req.body);
        console.log('✅ Property created successfully:', newProperty._id);
        console.log('📸 Photos saved in MongoDB:', newProperty.photos);

        res.status(201).json({
            success: true,
            data: { property: newProperty }
        });
    } catch (err) {
        console.error('❌ Error creating property:', err.message);
        next(err);
    }
};

exports.updateProperty = async (req, res, next) => {
    try {
        console.log('📝 Updating property:', req.params.id);

        let property = await Property.findById(req.params.id);
        if (!property) {
            return next(new AppError('No property found with that ID', 404));
        }

        // Check ownership
        if (property.hostId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('You do not have permission to update this property', 403));
        }

        // Parse Location Fields (from FormData flat keys)
        if (!req.body.location && (req.body['location[city]'] || req.body['location[country]'])) req.body.location = property.location || {};
        if (req.body['location[address]']) req.body.location.address = req.body['location[address]'];
        if (req.body['location[city]']) req.body.location.city = req.body['location[city]'];
        if (req.body['location[country]']) req.body.location.country = req.body['location[country]'];

        // Handle Photos (KEEP existing + ADD new)
        let finalPhotos = [];
        if (req.body.existingPhotos) {
            finalPhotos = Array.isArray(req.body.existingPhotos)
                ? req.body.existingPhotos
                : [req.body.existingPhotos];
        }

        // Handle NEW Image Uploads from Cloudinary
        // CRITICAL: multer-storage-cloudinary automatically uploads to Cloudinary
        // file.path contains the Cloudinary secure_url
        if (req.files && req.files.length > 0) {
            const newPhotos = req.files.map(file => file.path); // Already Cloudinary URLs
            console.log(`✅ Uploaded ${req.files.length} new images to Cloudinary:`, newPhotos);
            finalPhotos = [...finalPhotos, ...newPhotos];
        }

        // If no files and no existing photos sent (but title etc were), 
        // it means all were removed? Be careful.
        // Usually, at least one photo should exist or we keep property.photos if not sent.
        if (req.body.existingPhotos || (req.files && req.files.length > 0)) {
            req.body.photos = finalPhotos;
            console.log('📸 Final photos array:', finalPhotos);
        }

        // Parse Amenities (if provided in flat format)
        if (!req.body.amenities) {
            const amenities = [];
            Object.keys(req.body).forEach(key => {
                if (key.startsWith('amenities[')) {
                    amenities.push(req.body[key]);
                }
            });
            if (amenities.length > 0) req.body.amenities = amenities;
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        console.log('✅ Property updated successfully');

        res.status(200).json({
            success: true,
            data: { property }
        });
    } catch (err) {
        console.error('❌ Error updating property:', err.message);
        next(err);
    }
};

exports.deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return next(new AppError('No property found with that ID', 404));
        }

        // Check ownership
        if (property.hostId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('You do not have permission to delete this property', 403));
        }

        // Cascade delete bookings related to this property
        await Booking.deleteMany({ propertyId: property._id });

        await property.deleteOne();

        res.status(204).json({
            success: true,
            data: null
        });
    } catch (err) {
        next(err);
    }
};
