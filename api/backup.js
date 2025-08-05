const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Chord = require('./models/chords');
const Song = require('./models/song');
const User = require('./models/user');

async function backupData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create backup directory
        const backupDir = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup-${timestamp}.json`);

        // Get all data
        const chords = await Chord.find({});
        const songs = await Song.find({});
        const users = await User.find({});

        const backupData = {
            timestamp: new Date().toISOString(),
            chords: chords,
            songs: songs,
            users: users
        };

        // Write to file
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
        console.log(`Backup created: ${backupPath}`);
        console.log(`Chords: ${chords.length}, Songs: ${songs.length}, Users: ${users.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Backup failed:', error);
        process.exit(1);
    }
}

backupData();