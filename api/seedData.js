const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Chord = require('./models/chords');
const Song = require('./models/song');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

// Sample chord data
const sampleChords = [
    { chordName: 'C' },
    { chordName: 'D' },
    { chordName: 'E' },
    { chordName: 'F' },
    { chordName: 'G' },
    { chordName: 'A' },
    { chordName: 'B' },
    { chordName: 'Cm' },
    { chordName: 'Dm' },
    { chordName: 'Em' },
    { chordName: 'Fm' },
    { chordName: 'Gm' },
    { chordName: 'Am' },
    { chordName: 'Bm' },
    { chordName: 'C7' },
    { chordName: 'D7' },
    { chordName: 'E7' },
    { chordName: 'F7' },
    { chordName: 'G7' },
    { chordName: 'A7' },
    { chordName: 'B7' }
];

// Sample song data
const sampleSongs = [
    {
        title: "Wonderwall",
        lyrics: "Today is gonna be the day that they're gonna throw it back to you...",
        status: 0 // Changed to PENDING
    },
    {
        title: "Hotel California",
        lyrics: "On a dark desert highway, cool wind in my hair...",
        status: 0 // Changed to PENDING
    },
    {
        title: "Stairway to Heaven",
        lyrics: "There's a lady who's sure all that glitters is gold...",
        status: 0 // Changed to PENDING
    },
    {
        title: "Sweet Child O' Mine",
        lyrics: "She's got a smile that it seems to me...",
        status: 0 // Changed to PENDING
    },
    {
        title: "Nothing Else Matters",
        lyrics: "So close, no matter how far...",
        status: 0 // Changed to PENDING
    }
];

// Sample user data
const sampleUsers = [
    {
        firstName: "John",
        lastName: "Doe",
        userName: "johndoe",
        email: "john@example.com",
        password: "password123",
        role: "admin"
    },
    {
        firstName: "Jane",
        lastName: "Smith",
        userName: "janesmith",
        email: "jane@example.com",
        password: "password123",
        role: "customer"
    }
];

async function seedData() {
    try {
        // Connect to MongoDB
        console.log('Attempting to connect to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully');

        // Clear existing data
        console.log('Clearing existing data...');
        await Chord.deleteMany({});
        await Song.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Insert chords
        console.log('Inserting chords...');
        const chords = await Chord.insertMany(sampleChords);
        console.log(`Inserted ${chords.length} chords:`, chords.map(c => c.chordName));

        // Hash passwords and insert users FIRST
        console.log('Inserting users...');
        const hashedUsers = await Promise.all(
            sampleUsers.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );
        const users = await User.insertMany(hashedUsers);
        console.log(`Inserted ${users.length} users`);

        // Get the admin user to assign as uploader for sample songs
        const adminUser = users.find(user => user.role === 'admin');
        
        // Update sample songs with required fields
        const songsWithUploader = sampleSongs.map(song => ({
            ...song,
            uploadedBy: adminUser._id,
            uploadedByUsername: adminUser.userName
        }));

        // Insert songs with uploader info
        console.log('Inserting songs...');
        const songs = await Song.insertMany(songsWithUploader);
        console.log(`Inserted ${songs.length} songs`);

        console.log('Seed data inserted successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

seedData(); 