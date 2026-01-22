const express = require('express');
const {
    register,
    login,
    getProfile,
    updateProfile,
    updatePassword
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', protect, getProfile);
const upload = require('../middlewares/uploadMiddleware');

router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.put('/password', protect, updatePassword);

module.exports = router;
