const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User'); // Import User model
const cloudinary = require('./config/cloudinary');
const dotenv = require('dotenv');

dotenv.config();

const migrateOldImages = async () => {
    try {
        console.log('🚀 Starting Comprehensive Image Migration to Cloudinary...');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. MIGRATE PROPERTY IMAGES
        console.log('\n--- 🏠 Migrating Property Images ---');
        const properties = await Property.find({});
        console.log(`📊 Found ${properties.length} properties total.`);

        let propertyUpdatedCount = 0;
        let propertyAlreadyUpToDate = 0;

        for (const property of properties) {
            let needsUpdate = false;
            const updatedPhotos = [];

            console.log(`\n🏠 Processing property: "${property.title}" (${property._id})`);

            for (const photo of property.photos) {
                // Skip if empty
                if (!photo) continue;

                // Check if photo is already a Cloudinary URL
                if (photo.includes('res.cloudinary.com')) {
                    console.log(`   ✅ Photo already in Cloudinary: ${photo.substring(0, 50)}...`);
                    updatedPhotos.push(photo);
                    propertyAlreadyUpToDate++;
                    continue;
                }

                // SECURITY CHECK: Skip LOGO (as per user request)
                if (photo.toLowerCase().includes('logo')) {
                    console.log(`   ⚠️ SKIPPING LOGO: ${photo}`);
                    updatedPhotos.push(photo);
                    continue;
                }

                console.log(`   🔄 Migrating old photo: ${photo}`);

                try {
                    // Upload to Cloudinary from URL or local path
                    const uploadResponse = await cloudinary.uploader.upload(photo, {
                        folder: 'wonderlust/properties',
                        resource_type: 'image'
                    });

                    console.log(`   ✨ Successfully uploaded to Cloudinary: ${uploadResponse.secure_url}`);
                    updatedPhotos.push(uploadResponse.secure_url);
                    needsUpdate = true;
                } catch (uploadError) {
                    console.error(`   ❌ Failed to migrate photo ${photo}:`, uploadError.message);
                    updatedPhotos.push(photo);
                }
            }

            if (needsUpdate) {
                property.photos = updatedPhotos;
                await property.save();
                console.log(`✅ Property updated in MongoDB!`);
                propertyUpdatedCount++;
            } else {
                console.log(`✅ No updates needed for this property.`);
            }
        }

        // 2. MIGRATE USER PROFILE PICTURES
        console.log('\n--- 👤 Migrating User Profile Pictures ---');
        const users = await User.find({ profilePicture: { $exists: true, $ne: '', $ne: null } });
        console.log(`📊 Found ${users.length} users with profile pictures.`);

        let userUpdatedCount = 0;
        let userAlreadyUpToDate = 0;

        for (const user of users) {
            const photo = user.profilePicture;

            // Check if photo is already a Cloudinary URL
            if (photo.includes('res.cloudinary.com')) {
                console.log(`👤 User ${user.username}: Already in Cloudinary.`);
                userAlreadyUpToDate++;
                continue;
            }

            // SECURITY CHECK: Skip LOGO
            if (photo.toLowerCase().includes('logo')) {
                console.log(`👤 User ${user.username}: ⚠️ SKIPPING LOGO as profile pic.`);
                continue;
            }

            console.log(`👤 User ${user.username}: 🔄 Migrating profile pic...`);

            try {
                const uploadResponse = await cloudinary.uploader.upload(photo, {
                    folder: 'wonderlust/profiles',
                    resource_type: 'image'
                });

                user.profilePicture = uploadResponse.secure_url;
                await user.save();
                console.log(`   ✨ Successfully updated for ${user.username}`);
                userUpdatedCount++;
            } catch (uploadError) {
                console.error(`   ❌ Failed for ${user.username}:`, uploadError.message);
            }
        }

        console.log('\n' + '='.repeat(30));
        console.log('📊 MIGRATION SUMMARY');
        console.log('--- PROPERTIES ---');
        console.log(`✅ Updated: ${propertyUpdatedCount}`);
        console.log(`📸 Already Up-to-date: ${propertyAlreadyUpToDate}`);
        console.log('--- USERS ---');
        console.log(`✅ Updated: ${userUpdatedCount}`);
        console.log(`👤 Already Up-to-date: ${userAlreadyUpToDate}`);
        console.log('='.repeat(30));

        process.exit(0);
    } catch (error) {
        console.error('❌ MIGRATION FAILED:', error);
        process.exit(1);
    }
};

migrateOldImages();

