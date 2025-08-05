const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Chord = require('../models/chords');
const Song = require('../models/song');
const User = require('../models/user');

// Migration tracking collection
const migrationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    appliedAt: { type: Date, default: Date.now },
    version: { type: Number, required: true }
});

const Migration = mongoose.model('Migration', migrationSchema);

class MigrationRunner {
    constructor() {
        this.migrations = [];
    }

    // Register a migration
    register(name, version, upFunction) {
        this.migrations.push({
            name,
            version,
            up: upFunction
        });
    }

    // Run all pending migrations
    async runMigrations() {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to MongoDB');

            // Sort migrations by version
            this.migrations.sort((a, b) => a.version - b.version);

            for (const migration of this.migrations) {
                const exists = await Migration.findOne({ name: migration.name });
                
                if (!exists) {
                    console.log(`Running migration: ${migration.name} (v${migration.version})`);
                    await migration.up();
                    
                    // Record the migration
                    await new Migration({
                        name: migration.name,
                        version: migration.version
                    }).save();
                    
                    console.log(`✓ Migration ${migration.name} completed`);
                } else {
                    console.log(`- Migration ${migration.name} already applied`);
                }
            }

            console.log('All migrations completed!');
            process.exit(0);
        } catch (error) {
            console.error('Migration failed:', error);
            process.exit(1);
        }
    }

    // Rollback last migration
    async rollback() {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            
            const lastMigration = await Migration.findOne().sort({ version: -1 });
            if (!lastMigration) {
                console.log('No migrations to rollback');
                return;
            }

            console.log(`Rolling back: ${lastMigration.name}`);
            // You can implement rollback logic here
            await Migration.deleteOne({ _id: lastMigration._id });
            console.log(`Rolled back: ${lastMigration.name}`);
            
            process.exit(0);
        } catch (error) {
            console.error('Rollback failed:', error);
            process.exit(1);
        }
    }
}

module.exports = MigrationRunner;

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

const bcrypt = require('bcrypt');

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
                status: 1
            },
            {
                title: "Hotel California",
                lyrics: "On a dark desert highway, cool wind in my hair...",
                status: 1
            },
            {
                title: "Stairway to Heaven",
                lyrics: "There's a lady who's sure all that glitters is gold...",
                status: 1
            },
            {
                title: "Sweet Child O' Mine",
                lyrics: "She's got a smile that it seems to me...",
                status: 1
            },
            {
                title: "Nothing Else Matters",
                lyrics: "So close, no matter how far...",
                status: 1
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

const MigrationRunner = require('./migrations/migrationRunner');
const Chord = require('./models/chords');
const Song = require('./models/song');
const User = require('./models/user');

// Import all migrations
const migration001 = require('./migrations/001_initial_schema');
const migration002 = require('./migrations/002_seed_initial_data');

const runner = new MigrationRunner();

// Register migrations
runner.register(
    migration001.name,
    migration001.version,
    async () => await migration001.up({ Chord, Song, User })
);

runner.register(
    migration002.name,
    migration002.version,
    async () => await migration002.up({ Chord, Song, User })
);

// Run migrations
const command = process.argv[2];

if (command === 'rollback') {
    runner.rollback();
} else {
    runner.runMigrations();
}

