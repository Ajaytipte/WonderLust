const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Load env vars
dotenv.config();

const app = express();

// Middleware
const path = require('path');
app.use(express.json());
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// CORS Configuration - Allow frontend to access backend
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.get('/', (req, res) => {
    res.send('WonderLust API is running...');
});

// CAUTION: This must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
