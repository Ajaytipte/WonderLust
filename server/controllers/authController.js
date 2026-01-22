const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d' // Fallback to 7 days
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined; // Hide password in response

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user
        }
    });
};

exports.register = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        console.log('📝 Registration attempt:', { username, email, role });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists:', email);
            return next(new AppError('Email already exists', 400));
        }

        const newUser = await User.create({
            username,
            email,
            password,
            role
        });

        console.log('✅ User created successfully:', newUser._id);
        createSendToken(newUser, 201, res);
    } catch (err) {
        console.error('❌ Registration error:', err.message);
        console.error('Error stack:', err.stack);
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { username, email, phone } = req.body;

        // Check if email is being changed to an existing one
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return next(new AppError('Email already in use', 400));
            }
        }

        // Handle Profile Picture Upload from Cloudinary
        // CRITICAL: multer-storage-cloudinary automatically uploads to Cloudinary
        // file.path contains the Cloudinary secure_url
        let picturePath = req.body.profilePicture; // If sent as string (rare now)
        if (req.file) {
            picturePath = req.file.path; // Already Cloudinary URL
            console.log('\u2705 Profile picture uploaded to Cloudinary:', picturePath);
        } else if (picturePath === undefined) {
            picturePath = req.user.profilePicture;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                username: username || req.user.username,
                email: email || req.user.email,
                phone: phone !== undefined ? phone : req.user.phone,
                profilePicture: picturePath
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return next(new AppError('Please provide current and new password', 400));
        }

        // Get user with password field
        const user = await User.findById(req.user.id).select('+password');

        // Check if current password is correct
        if (!(await user.matchPassword(currentPassword))) {
            return next(new AppError('Current password is incorrect', 401));
        }

        // Update password
        user.password = newPassword;
        await user.save(); // Will trigger pre-save hook to hash password

        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};
