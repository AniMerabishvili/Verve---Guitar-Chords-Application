const bcrypt = require('bcryptjs');

module.exports = {
    name: '002_seed_initial_data',
    version: 2,
    up: async (models) => {
        const { Chord, Song, User } = models;

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
            { chordName: 'B7' },
            { chordName: 'C#m' },
            { chordName: 'D#m' },
            { chordName: 'F#m' },
            { chordName: 'G#m' },
            { chordName: 'A#m' }
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
                password: await bcrypt.hash("password123", 10),
                role: "admin"
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

        // Insert data
        await Chord.insertMany(sampleChords);
        await Song.insertMany(sampleSongs);
        await User.insertMany(sampleUsers);

        console.log(`✓ Seeded ${sampleChords.length} chords`);
        console.log(`✓ Seeded ${sampleSongs.length} songs`);
        console.log(`✓ Seeded ${sampleUsers.length} users`);
    }
}; 