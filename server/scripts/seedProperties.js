const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const User = require('../models/User');

dotenv.config();

// Sample property data - Indian locations
const sampleProperties = [
    {
        title: 'Luxury Villa with Pool in Lonavla',
        description: 'Beautiful 4BHK villa with private pool, perfect for family getaways. Enjoy stunning valley views and modern amenities.',
        location: {
            address: 'Tungarli Lake Road',
            city: 'Lonavla',
            state: 'Maharashtra',
            country: 'India'
        },
        pricePerNight: 15400,
        type: 'villa',
        maxGuests: 8,
        amenities: ['WiFi', 'Pool', 'Parking', 'Kitchen', 'AC', 'TV'],
        photos: [
            'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
        ],
        rules: 'No smoking, No pets, Suitable for children',
        ownerOffers: 'Free breakfast, Airport pickup available'
    },
    {
        title: 'Cozy Cabin in Manali Mountains',
        description: 'Peaceful mountain retreat with breathtaking Himalayan views. Perfect for couples and small families.',
        location: {
            address: 'Old Manali',
            city: 'Manali',
            state: 'Himachal Pradesh',
            country: 'India'
        },
        pricePerNight: 2840,
        type: 'cabin',
        maxGuests: 4,
        amenities: ['WiFi', 'Parking', 'Kitchen', 'TV'],
        photos: [
            'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
            'https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=800'
        ],
        rules: 'No smoking inside, Quiet hours after 10 PM',
        ownerOffers: 'Bonfire setup, Local tour guide recommendations'
    },
    {
        title: 'Heritage Palace Stay in Jaipur',
        description: 'Experience royal living in this restored heritage property. Authentic Rajasthani architecture and hospitality.',
        location: {
            address: 'Civil Lines',
            city: 'Jaipur',
            state: 'Rajasthan',
            country: 'India'
        },
        pricePerNight: 11597,
        type: 'house',
        maxGuests: 6,
        amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Pool'],
        photos: [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
        ],
        rules: 'Respectful of heritage property, No parties',
        ownerOffers: 'Traditional Rajasthani dinner, City palace tour'
    },
    {
        title: 'Modern Apartment in Mumbai',
        description: 'Stylish 2BHK apartment in the heart of Mumbai. Close to business districts and tourist attractions.',
        location: {
            address: 'Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India'
        },
        pricePerNight: 4512,
        type: 'apartment',
        maxGuests: 4,
        amenities: ['WiFi', 'AC', 'Kitchen', 'TV', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
        ],
        rules: 'No smoking, No pets, Check-in after 2 PM',
        ownerOffers: 'Netflix subscription, High-speed internet'
    },
    {
        title: 'Beachfront Villa in Goa',
        description: 'Stunning beachfront property with direct beach access. Perfect for beach lovers and sunset watchers.',
        location: {
            address: 'Candolim Beach Road',
            city: 'Goa',
            state: 'Goa',
            country: 'India'
        },
        pricePerNight: 8500,
        type: 'villa',
        maxGuests: 6,
        amenities: ['WiFi', 'Pool', 'Parking', 'Kitchen', 'AC'],
        photos: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
        ],
        rules: 'Beach parties allowed till midnight, No smoking inside',
        ownerOffers: 'BBQ setup, Water sports discounts'
    },
    {
        title: 'Treehouse Stay in Wayanad',
        description: 'Unique treehouse experience in the Western Ghats. Surrounded by lush forests and wildlife.',
        location: {
            address: 'Vythiri',
            city: 'Wayanad',
            state: 'Kerala',
            country: 'India'
        },
        pricePerNight: 7500,
        type: 'cabin',
        maxGuests: 2,
        amenities: ['WiFi', 'Kitchen', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
            'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800'
        ],
        rules: 'Respect wildlife, No loud music',
        ownerOffers: 'Plantation tour, Bird watching guide'
    },
    {
        title: 'Luxury Hotel Suite in Udaipur',
        description: 'Premium hotel suite with lake views. Five-star amenities and world-class service.',
        location: {
            address: 'Lake Pichola',
            city: 'Udaipur',
            state: 'Rajasthan',
            country: 'India'
        },
        pricePerNight: 18320,
        type: 'hotel',
        maxGuests: 3,
        amenities: ['WiFi', 'Pool', 'AC', 'TV', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
        ],
        rules: 'Hotel policies apply',
        ownerOffers: 'Spa discount, Complimentary breakfast'
    },
    {
        title: 'Riverside Cottage in Rishikesh',
        description: 'Peaceful cottage by the Ganges. Ideal for yoga retreats and spiritual seekers.',
        location: {
            address: 'Tapovan',
            city: 'Rishikesh',
            state: 'Uttarakhand',
            country: 'India'
        },
        pricePerNight: 3200,
        type: 'house',
        maxGuests: 4,
        amenities: ['WiFi', 'Kitchen', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
            'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800'
        ],
        rules: 'Vegetarian only, No alcohol',
        ownerOffers: 'Yoga sessions, Meditation guide'
    },
    {
        title: 'Houseboat in Kerala Backwaters',
        description: 'Traditional Kerala houseboat experience. Cruise through serene backwaters.',
        location: {
            address: 'Vembanad Lake',
            city: 'Alleppey',
            state: 'Kerala',
            country: 'India'
        },
        pricePerNight: 9123,
        type: 'other',
        maxGuests: 4,
        amenities: ['WiFi', 'Kitchen', 'AC'],
        photos: [
            'https://images.unsplash.com/photo-1605640837898-4fbc658f18c4?w=800',
            'https://images.unsplash.com/photo-1578066061825-c90634e19b1e?w=800'
        ],
        rules: 'Swimming with caution, Life jackets mandatory',
        ownerOffers: 'Traditional Kerala meals, Fishing equipment'
    },
    {
        title: 'Mountain View Apartment in Shimla',
        description: 'Charming apartment with panoramic mountain views. Perfect for snow lovers.',
        location: {
            address: 'Mall Road',
            city: 'Shimla',
            state: 'Himachal Pradesh',
            country: 'India'
        },
        pricePerNight: 3850,
        type: 'apartment',
        maxGuests: 5,
        amenities: ['WiFi', 'Kitchen', 'Parking', 'TV'],
        photos: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
        ],
        rules: 'Heating charges extra in winter',
        ownerOffers: 'Toy train booking assistance'
    },
    {
        title: 'Desert Camp in Jaisalmer',
        description: 'Authentic desert camping experience with cultural programs and camel safaris.',
        location: {
            address: 'Sam Sand Dunes',
            city: 'Jaisalmer',
            state: 'Rajasthan',
            country: 'India'
        },
        pricePerNight: 4500,
        type: 'other',
        maxGuests: 2,
        amenities: ['WiFi', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
        ],
        rules: 'Respect local culture, Desert safety guidelines',
        ownerOffers: 'Camel safari, Folk dance performance'
    },
    {
        title: 'Tea Estate Bungalow in Darjeeling',
        description: 'Colonial-era bungalow amidst tea gardens. Wake up to misty mountain views.',
        location: {
            address: 'Happy Valley',
            city: 'Darjeeling',
            state: 'West Bengal',
            country: 'India'
        },
        pricePerNight: 6800,
        type: 'house',
        maxGuests: 6,
        amenities: ['WiFi', 'Kitchen', 'Parking', 'TV'],
        photos: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
        ],
        rules: 'No smoking, Quiet environment',
        ownerOffers: 'Tea tasting tour, Toy train tickets'
    },
    {
        title: 'Penthouse in Delhi NCR',
        description: 'Luxurious penthouse with rooftop terrace. Modern amenities in premium location.',
        location: {
            address: 'Golf Course Road',
            city: 'Gurugram',
            state: 'Haryana',
            country: 'India'
        },
        pricePerNight: 12000,
        type: 'apartment',
        maxGuests: 6,
        amenities: ['WiFi', 'Pool', 'Parking', 'Kitchen', 'AC', 'TV'],
        photos: [
            'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
        ],
        rules: 'No parties after 11 PM',
        ownerOffers: 'Gym access, Swimming pool'
    },
    {
        title: 'Lake View Cottage in Nainital',
        description: 'Charming cottage overlooking Naini Lake. Peaceful retreat in the hills.',
        location: {
            address: 'Mallital',
            city: 'Nainital',
            state: 'Uttarakhand',
            country: 'India'
        },
        pricePerNight: 5200,
        type: 'cabin',
        maxGuests: 4,
        amenities: ['WiFi', 'Kitchen', 'Parking', 'TV'],
        photos: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
        ],
        rules: 'Quiet hours after 10 PM',
        ownerOffers: 'Boating tickets, Local sightseeing guide'
    },
    {
        title: 'Beach Shack in Palolem, Goa',
        description: 'Rustic beach shack right on the sand. Fall asleep to ocean waves.',
        location: {
            address: 'Palolem Beach',
            city: 'South Goa',
            state: 'Goa',
            country: 'India'
        },
        pricePerNight: 2500,
        type: 'other',
        maxGuests: 2,
        amenities: ['WiFi', 'Kitchen'],
        photos: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
            'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800'
        ],
        rules: 'Beach rules apply, No loud music after midnight',
        ownerOffers: 'Kayaking, Dolphin watching tour'
    },
    {
        title: 'Forest Lodge in Coorg',
        description: 'Secluded lodge in coffee plantations. Perfect for nature lovers.',
        location: {
            address: 'Madikeri',
            city: 'Coorg',
            state: 'Karnataka',
            country: 'India'
        },
        pricePerNight: 5800,
        type: 'house',
        maxGuests: 5,
        amenities: ['WiFi', 'Kitchen', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
        ],
        rules: 'Wildlife safety guidelines',
        ownerOffers: 'Coffee plantation tour, Trekking guide'
    },
    {
        title: 'Urban Loft in Bangalore',
        description: 'Trendy loft in tech hub. Perfect for business travelers.',
        location: {
            address: 'Koramangala',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India'
        },
        pricePerNight: 4200,
        type: 'apartment',
        maxGuests: 3,
        amenities: ['WiFi', 'AC', 'Kitchen', 'TV', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        rules: 'Self check-in available',
        ownerOffers: 'Co-working space access, 24/7 support'
    },
    {
        title: 'Royal Suite in Hyderabad',
        description: 'Opulent suite in heritage hotel. Experience Nizami hospitality.',
        location: {
            address: 'Charminar',
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India'
        },
        pricePerNight: 9800,
        type: 'hotel',
        maxGuests: 4,
        amenities: ['WiFi', 'Pool', 'AC', 'TV', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
        ],
        rules: 'Hotel standards apply',
        ownerOffers: 'Heritage walk, Traditional Hyderabadi biryani'
    },
    {
        title: 'Artist Studio in Puducherry',
        description: 'French colonial style studio. Perfect for creative souls.',
        location: {
            address: 'White Town',
            city: 'Puducherry',
            state: 'Puducherry',
            country: 'India'
        },
        pricePerNight: 3500,
        type: 'apartment',
        maxGuests: 2,
        amenities: ['WiFi', 'Kitchen', 'AC'],
        photos: [
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
        ],
        rules: 'Respect neighbors, Quiet area',
        ownerOffers: 'Auroville tour, French cafe recommendations'
    },
    {
        title: 'Farmstay in Punjab',
        description: 'Authentic farm experience. Participate in farming activities.',
        location: {
            address: 'Rural Amritsar',
            city: 'Amritsar',
            state: 'Punjab',
            country: 'India'
        },
        pricePerNight: 2800,
        type: 'house',
        maxGuests: 8,
        amenities: ['WiFi', 'Kitchen', 'Parking'],
        photos: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
            'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=800'
        ],
        rules: 'Farm safety rules, Suitable for families',
        ownerOffers: 'Organic meals, Tractor ride, Golden Temple visit'
    }
];

const seedDatabase = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected!');

        // Find a host user or create a default one
        let hostUser = await User.findOne({ role: 'host' });

        if (!hostUser) {
            console.log('Creating default host user...');
            hostUser = await User.create({
                username: 'WonderLust Host',
                email: 'host@wonderlust.com',
                password: 'password123',
                role: 'host'
            });
            console.log('✅ Default host created!');
        }

        // Clear existing properties
        console.log('🗑️  Clearing existing properties...');
        await Property.deleteMany({});

        // Add host ID to all properties
        const propertiesWithHost = sampleProperties.map(prop => ({
            ...prop,
            hostId: hostUser._id,
            rating: 0,
            numReviews: 0
        }));

        // Insert sample properties
        console.log('📝 Inserting sample properties...');
        await Property.insertMany(propertiesWithHost);

        console.log(`✅ Successfully seeded ${sampleProperties.length} properties!`);
        console.log('🎉 Database setup complete!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
