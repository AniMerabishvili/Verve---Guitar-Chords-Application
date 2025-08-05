const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Song = require('../models/song');

module.exports = {
    name: '007_fix_sample_songs_status',
    version: 7,
    up: async (models) => {
        const { Song } = models;

        // Find sample songs that were incorrectly set to approved (status: 1)
        const sampleSongTitles = [
            "Wonderwall",
            "Hotel California", 
            "Stairway to Heaven",
            "Sweet Child O' Mine",
            "Nothing Else Matters"
        ];

        const songsToFix = await Song.find({
            title: { $in: sampleSongTitles },
            status: 1
        });

        if (songsToFix.length > 0) {
            await Song.updateMany(
                { title: { $in: sampleSongTitles }, status: 1 },
                { $set: { status: 0 } } // Set to PENDING
            );
            
            console.log(`✓ Fixed ${songsToFix.length} sample songs to PENDING status`);
        } else {
            console.log('✓ No sample songs need fixing');
        }
    }
}; 