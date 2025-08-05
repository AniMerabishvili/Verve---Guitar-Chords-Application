const mongoose = require('mongoose');
require('dotenv').config();

const Chord = require('./models/chords');
const Song = require('./models/song');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

async function resetDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear all existing data
        console.log('Clearing all existing data...');
        await Chord.deleteMany({});
        await Song.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared all existing data');

        // Create sample chords
        const sampleChords = [
            { chordName: 'C' }, { chordName: 'D' }, { chordName: 'E' },
            { chordName: 'F' }, { chordName: 'G' }, { chordName: 'A' },
            { chordName: 'B' }, { chordName: 'Cm' }, { chordName: 'Dm' },
            { chordName: 'Em' }, { chordName: 'Fm' }, { chordName: 'Gm' },
            { chordName: 'Am' }, { chordName: 'Bm' }, { chordName: 'C7' },
            { chordName: 'D7' }, { chordName: 'E7' }, { chordName: 'F7' },
            { chordName: 'G7' }, { chordName: 'A7' }, { chordName: 'B7' }
        ];

        console.log('Creating chords...');
        const chords = await Chord.insertMany(sampleChords);
        console.log(`Created ${chords.length} chords`);

        // Create users first
        const users = [
            {
                firstName: "Admin",
                lastName: "User",
                userName: "admin",
                email: "admin@guitarchords.com",
                password: await bcrypt.hash("admin123", 10),
                role: "admin"
            },
            {
                firstName: "John",
                lastName: "Doe",
                userName: "johndoe",
                email: "john@example.com",
                password: await bcrypt.hash("password123", 10),
                role: "customer"
            },
            {
                firstName: "Jane",
                lastName: "Smith",
                userName: "janesmith",
                email: "jane@example.com",
                password: await bcrypt.hash("password123", 10),
                role: "customer"
            }
        ];

        console.log('Creating users...');
        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);

        // Get admin user
        const adminUser = createdUsers.find(user => user.role === 'admin');
        const customerUser = createdUsers.find(user => user.role === 'customer');

        // Create sample songs with PENDING status (status: 0)
        const sampleSongs = [
            {
                title: "Wonderwall",
                lyrics: "Today is gonna be the day that they're gonna throw it back to you...",
                status: 0, // PENDING - will appear in admin dashboard
                uploadedBy: customerUser._id,
                uploadedByUsername: customerUser.userName
            },
            {
                title: "Hotel California",
                lyrics: "On a dark desert highway, cool wind in my hair...",
                status: 0, // PENDING - will appear in admin dashboard
                uploadedBy: customerUser._id,
                uploadedByUsername: customerUser.userName
            },
            {
                title: "Stairway to Heaven",
                lyrics: "There's a lady who's sure all that glitters is gold...",
                status: 0, // PENDING - will appear in admin dashboard
                uploadedBy: customerUser._id,
                uploadedByUsername: customerUser.userName
            }
        ];

        console.log('Creating songs with PENDING status...');
        const songs = await Song.insertMany(sampleSongs);
        console.log(`Created ${songs.length} songs with PENDING status`);

        console.log('\n=== DATABASE RESET COMPLETE ===');
        console.log('✅ All existing data cleared');
        console.log('✅ Created users: admin, johndoe, janesmith');
        console.log('✅ Created songs with PENDING status (status: 0)');
        console.log('\n=== TESTING INSTRUCTIONS ===');
        console.log('1. Login as admin (admin@guitarchords.com / admin123)');
        console.log('2. Go to admin dashboard - you should see 3 pending songs');
        console.log('3. Approve some songs - they will appear on homepage');
        console.log('4. Login as customer (john@example.com / password123)');
        console.log('5. Upload a new song - it should go to admin for review');
        console.log('6. Check "Your Songs" in profile - should show pending status');

        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase(); 