# WonderLust

A modern property booking platform inspired by Airbnb, connecting travelers with unique accommodations worldwide.

## Overview

WonderLust is a full-stack web application that enables property owners to list their spaces and travelers to discover and book accommodations. The platform provides a seamless experience for browsing properties, making reservations, and managing bookings.

**Target Audience:**
- Property owners looking to rent their spaces
- Travelers seeking unique accommodations
- Users wanting to explore properties by location and type

**Main Purpose:**
WonderLust simplifies the property rental process by providing an intuitive interface for hosting, discovering, and booking properties with integrated payment processing, reviews, and image management.

## Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Git

### Clone Repository

```bash
git clone https://github.com/Ajaytipte/WonderLust.git
cd WonderLust
```

### Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server Port
PORT=5000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Environment
NODE_ENV=development
```

### Run Frontend & Backend

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend Development Server:**
```bash
cd client
npm run dev
```

### Open Website

Navigate to `http://localhost:5173` in your browser.

## Tech Stack

### Frontend
- **React** - UI library for building interactive interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library
- **Leaflet** - Interactive maps

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage and CDN
- **Joi** - Data validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB database

### Authentication
- **JWT (JSON Web Tokens)** - Secure authentication
- **bcryptjs** - Password encryption

### Image Storage
- **Cloudinary** - Cloud-based image management and CDN delivery

### Deployment Platform
- **AWS** - Scalable cloud infrastructure


## Project Structure

```
WonderLust/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   ├── services/      # API service layer
│   │   └── assets/        # Static assets
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middleware
│   ├── utils/            # Utility functions
│   └── server.js         # Application entry point
│
└── README.md             # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/password` - Update password (protected)

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (protected)
- `PATCH /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)

### Bookings
- `GET /api/bookings` - Get user bookings (protected)
- `POST /api/bookings` - Create booking (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

### Reviews
- `GET /api/properties/:propertyId/reviews` - Get property reviews
- `POST /api/properties/:propertyId/reviews` - Create review (protected)

### Wishlist
- `GET /api/wishlist` - Get user wishlist (protected)
- `POST /api/wishlist` - Add to wishlist (protected)
- `DELETE /api/wishlist/:propertyId` - Remove from wishlist (protected)

## Database Schema

### User Model
- username (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- phone (String)
- role (String, enum: user/admin)
- profilePicture (String, Cloudinary URL)
- wishlist (Array of Property references)

### Property Model
- hostId (User reference, required)
- title (String, required)
- description (String, required)
- location (Object with address, city, state, country, coordinates)
- pricePerNight (Number, required)
- photos (Array of Strings, Cloudinary URLs)
- amenities (Array of Strings)
- maxGuests (Number, required)
- type (String, enum: apartment/house/villa/cabin/hotel/other)
- rating (Number, default 0)
- numReviews (Number, default 0)

### Booking Model
- userId (User reference, required)
- propertyId (Property reference, required)
- checkIn (Date, required)
- checkOut (Date, required)
- guests (Number, required)
- totalPrice (Number, required)
- status (String, enum: pending/confirmed/cancelled)

### Review Model
- userId (User reference, required)
- propertyId (Property reference, required)
- rating (Number, 1-5, required)
- comment (String, required)

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP security headers with Helmet
- CORS protection
- Input validation with Joi
- Protected routes with authentication middleware
- Role-based authorization
- Secure HTTP-only tokens
- Environment variable protection

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## Acknowledgments

- Cloudinary for image hosting and CDN services
- MongoDB Atlas for database hosting
- OpenStreetMap for map data
- Leaflet for map integration
- The open-source community for excellent tools and libraries
