const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Song = require('../models/song');
const User = require('../models/user');

module.exports = {
    name: '005_add_song_approval_system',
    version: 5,
    up: async (models) => {
        const { Song, User } = models;

        // Find admin user to assign to existing songs
        const adminUser = await User.findOne({ role: 'admin' });
        
        if (!adminUser) {
            console.log('⚠️ No admin user found, creating one...');
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
            console.log('✓ Created admin user');
        }

        // Update existing songs to have user information and pending status
        const songsToUpdate = await Song.find({
            $or: [
                { uploadedBy: { $exists: false } },
                { uploadedByUsername: { $exists: false } },
                { status: { $exists: false } }
            ]
        });

        if (songsToUpdate.length > 0) {
            const adminUser = await User.findOne({ role: 'admin' });
            
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
            
            console.log(`✓ Updated ${songsToUpdate.length} existing songs with user information and PENDING status`);
        } else {
            console.log('✓ All songs already have proper user information');
        }

        // Create indexes for better performance
        await Song.collection.createIndex({ uploadedBy: 1 });
        await Song.collection.createIndex({ status: 1 });
        await Song.collection.createIndex({ uploadedBy: 1, status: 1 });

        console.log('✓ Created indexes for song approval system');
    }
}; 