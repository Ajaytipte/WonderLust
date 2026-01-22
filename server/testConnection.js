const mongoose = require('mongoose');
require('dotenv').config();

console.log('\n🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGO_URI?.replace(/:[^:]*@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ SUCCESS! MongoDB Connected!');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
        console.log('🔌 Host:', mongoose.connection.host);
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ FAILED! MongoDB Connection Error:');
        console.log('\nError Details:');
        console.log('  Code:', err.code);
        console.log('  Message:', err.message);
        console.log('\n💡 Solutions:');
        console.log('  1. Check MongoDB Atlas - Database Access - verify user exists');
        console.log('  2. Check MongoDB Atlas - Network Access - whitelist your IP');
        console.log('  3. Try resetting the database user password');
        console.log('  4. Verify connection string format');
        console.log('\n🔗 MongoDB Atlas: https://cloud.mongodb.com/\n');
        process.exit(1);
    });
