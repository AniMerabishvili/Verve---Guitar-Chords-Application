const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Song = require('../models/song');

module.exports = {
    name: '006_fix_song_status',
    version: 6,
    up: async (models) => {
        const { Song } = models;

        // Find songs that were incorrectly set to approved (status: 1) 
        // but don't have proper user information
        const songsToFix = await Song.find({
            status: 1,
            $or: [
                { uploadedBy: { $exists: false } },
                { uploadedByUsername: { $exists: false } }
            ]
        });

        if (songsToFix.length > 0) {
            // Find admin user
            const User = models.User;
            const adminUser = await User.findOne({ role: 'admin' });
            
            if (adminUser) {
                await Song.updateMany(
                    { _id: { $in: songsToFix.map(s => s._id) } },
                    {
                        $set: {
                            uploadedBy: adminUser._id,
                            uploadedByUsername: adminUser.userName,
                            status: 0 // Set to PENDING for admin approval
                        }
                    }
                );
                
                console.log(`✓ Fixed ${songsToFix.length} songs with incorrect status`);
            } else {
                console.log('⚠️ No admin user found, skipping status fix');
            }
        } else {
            console.log('✓ No songs need status fixing');
        }
    }
}; 