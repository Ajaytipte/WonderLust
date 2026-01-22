const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const Review = require('../models/Review');

dotenv.config();

const resetData = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected!');

        console.log('🗑️  Deleting all reviews...');
        await Review.deleteMany({});
        console.log('✅ All reviews deleted!');

        console.log('🔄 Resetting all property ratings and review counts...');
        await Property.updateMany({}, {
            rating: 0,
            numReviews: 0
        });
        console.log('✅ All properties reset to 0 binary rating and 0 reviews!');

        console.log('🎉 Cleanup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during reset:', error);
        process.exit(1);
    }
};

resetData();
