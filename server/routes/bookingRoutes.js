const express = require('express');
const {
    createBooking,
    getMyBookings,
    getHostBookings,
    deleteBooking,
    getBookingById
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All routes require login

router.get('/my-bookings', getMyBookings);
router.get('/host-bookings', getHostBookings);
router.get('/:id', getBookingById);

router.post('/', createBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
