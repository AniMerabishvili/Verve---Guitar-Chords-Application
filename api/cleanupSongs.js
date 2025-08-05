const mongoose = require('mongoose');
require('dotenv').config();

const Song = require('./models/song');
const User = require('./models/user');

async function cleanupSongs() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found. Creating one...');
            const bcrypt = require('bcrypt');
            const newAdmin = new User({
                firstName: "Admin",
                lastName: "User",
                userName: "admin",
                email: "admin@guitarchords.com",
                password: await bcrypt.hash("admin123", 10),
                role: "admin"
            });
            await newAdmin.save();
            console.log('Created admin user');
        }

        // Find songs without proper user information
        const songsToUpdate = await Song.find({
            $or: [
                { uploadedBy: { $exists: false } },
                { uploadedByUsername: { $exists: false } },
                { status: { $exists: false } }
            ]
        });

        console.log(`Found ${songsToUpdate.length} songs to update`);

        if (songsToUpdate.length > 0) {
            const adminUser = await User.findOne({ role: 'admin' });
            
            // Update songs to have proper user information and PENDING status
            await Song.updateMany(
                { _id: { $in: songsToUpdate.map(s => s._id) } },
                {
                    $set: {
                        uploadedBy: adminUser._id,
                        uploadedByUsername: adminUser.userName,
                        status: 0 // Mark existing songs as PENDING for admin approval
                    }
                }
            );
            
            console.log(`Updated ${songsToUpdate.length} songs with user information and PENDING status`);
        } else {
            console.log('All songs already have proper user information');
        }

        // Also update any songs with status 0 to have proper user info
        const pendingSongs = await Song.find({ status: 0 });
        if (pendingSongs.length > 0) {
            const adminUser = await User.findOne({ role: 'admin' });
            
            await Song.updateMany(
                { status: 0 },
                {
                    $set: {
                        uploadedBy: adminUser._id,
                        uploadedByUsername: adminUser.userName
                    }
                }
            );
            
            console.log(`Updated ${pendingSongs.length} pending songs with user information`);
        }

        console.log('Cleanup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

cleanupSongs(); 