const express = require('express');
const {
    getAllProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty
} = require('../controllers/propertyController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:propertyId/reviews', reviewRouter);

router.route('/')
    .get(getAllProperties)
    .post(protect, upload.array('photos', 5), createProperty);

router.route('/:id')
    .get(getProperty)
    .patch(protect, upload.array('photos', 5), updateProperty)

    .delete(protect, deleteProperty);

module.exports = router;
