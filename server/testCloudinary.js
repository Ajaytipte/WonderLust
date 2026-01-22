const cloudinary = require('./config/cloudinary');
const dotenv = require('dotenv');

dotenv.config();

const testCloudinaryConnection = async () => {
    console.log('🧪 Testing Cloudinary Connection...\n');

    console.log('📋 Configuration:');
    console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('   API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + '...');
    console.log('');

    try {
        // Test connection by listing resources
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'wonderlust',
            max_results: 5
        });

        console.log('✅ Cloudinary Connection: SUCCESS!');
        console.log(`📁 Folder: wonderlust`);
        console.log(`📸 Total Images Found: ${result.total_count}`);
        console.log('');

        if (result.resources.length > 0) {
            console.log('🖼️  Recent Images:');
            result.resources.forEach((resource, index) => {
                console.log(`   ${index + 1}. ${resource.public_id}`);
                console.log(`      URL: ${resource.secure_url}`);
                console.log(`      Size: ${(resource.bytes / 1024).toFixed(2)} KB`);
                console.log('');
            });
        } else {
            console.log('ℹ️  No images found in "wonderlust" folder yet.');
            console.log('   Upload your first image to test the complete flow!');
        }

        console.log('✅ Cloudinary is ready to receive uploads!');
        console.log('🎯 Next Step: Create a property or update your profile with an image.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Cloudinary Connection: FAILED!');
        console.error('');
        console.error('Error Details:', error.message);

        if (error.http_code === 401) {
            console.error('');
            console.error('⚠️  Authentication Error:');
            console.error('   Please check your Cloudinary credentials in .env file');
            console.error('   - CLOUDINARY_CLOUD_NAME');
            console.error('   - CLOUDINARY_API_KEY');
            console.error('   - CLOUDINARY_API_SECRET');
        }

        process.exit(1);
    }
};

testCloudinaryConnection();
