const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Chord = require('./models/chords');
const Song = require('./models/song');
const User = require('./models/user');

async function restoreData(backupFile) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Read backup file
        const backupPath = path.join(__dirname, 'backups', backupFile);
        if (!fs.existsSync(backupPath)) {
            console.error('Backup file not found:', backupPath);
            process.exit(1);
        }

        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        console.log('Backup loaded from:', backupFile);

        // Clear existing data
        await Chord.deleteMany({});
        await Song.deleteMany({});
        await User.deleteMany({});

        // Restore data
        if (backupData.chords && backupData.chords.length > 0) {
            await Chord.insertMany(backupData.chords);
            console.log(`Restored ${backupData.chords.length} chords`);
        }

        if (backupData.songs && backupData.songs.length > 0) {
            await Song.insertMany(backupData.songs);
            console.log(`Restored ${backupData.songs.length} songs`);
        }

        if (backupData.users && backupData.users.length > 0) {
            await User.insertMany(backupData.users);
            console.log(`Restored ${backupData.users.length} users`);
        }

        console.log('Data restored successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Restore failed:', error);
        process.exit(1);
    }
}

// Get backup file from command line argument
const backupFile = process.argv[2];
if (!backupFile) {
    console.error('Usage: node restore.js <backup-file-name>');
    console.error('Example: node restore.js backup-2024-01-15T10-30-00-000Z.json');
    process.exit(1);
}

restoreData(backupFile); 