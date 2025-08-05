const bcrypt = require('bcrypt');

module.exports = {
    name: '001_initial_schema',
    version: 1,
    up: async (models) => {
        const { Chord, Song, User } = models;

        // Create indexes for better performance
        await Chord.collection.createIndex({ chordName: 1 }, { unique: true });
        await Song.collection.createIndex({ title: 1 });
        await User.collection.createIndex({ email: 1 }, { unique: true });
        await User.collection.createIndex({ userName: 1 }, { unique: true });

        console.log('✓ Created database indexes');
    }
}; 