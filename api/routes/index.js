var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// TEMPORARY: Seed data endpoint - REMOVE AFTER USE
router.get('/admin/seed-data-2024', async function(req, res, next) {
  try {
    // Add security check - only allow with secret key
    const secretKey = req.query.secret;
    if (secretKey !== 'seed-data-secret-2024') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const Chord = require('../models/chords');
    const Song = require('../models/song');
    const User = require('../models/user');

    // Sample data (same as in your seedData.js)
    const sampleChords = [
        { chordName: 'C' }, { chordName: 'D' }, { chordName: 'E' }, { chordName: 'F' }, 
        { chordName: 'G' }, { chordName: 'A' }, { chordName: 'B' }, { chordName: 'Cm' }, 
        { chordName: 'Dm' }, { chordName: 'Em' }, { chordName: 'Fm' }, { chordName: 'Gm' }, 
        { chordName: 'Am' }, { chordName: 'Bm' }, { chordName: 'C7' }, { chordName: 'D7' }, 
        { chordName: 'E7' }, { chordName: 'F7' }, { chordName: 'G7' }, { chordName: 'A7' }, 
        { chordName: 'B7' }
    ];

    const sampleSongs = [
        { title: "Wonderwall", lyrics: "Today is gonna be the day that they're gonna throw it back to you...", status: 0 },
        { title: "Hotel California", lyrics: "On a dark desert highway, cool wind in my hair...", status: 0 },
        { title: "Stairway to Heaven", lyrics: "There's a lady who's sure all that glitters is gold...", status: 0 },
        { title: "Sweet Child O' Mine", lyrics: "She's got a smile that it seems to me...", status: 0 },
        { title: "Nothing Else Matters", lyrics: "So close, no matter how far...", status: 0 }
    ];

    const sampleUsers = [
        { firstName: "Admin", lastName: "Adminashvili", userName: "Admin", email: "admin@gmail.com", password: "password123", role: "admin1" },
        { firstName: "Jane", lastName: "Smith", userName: "janesmith", email: "jane@example.com", password: "password123", role: "customer" }
    ];

    // Clear existing data
    console.log('Clearing existing data...');
    await Chord.deleteMany({});
    await Song.deleteMany({});
    await User.deleteMany({});

    // Insert chords
    console.log('Inserting chords...');
    const chords = await Chord.insertMany(sampleChords);

    // Hash passwords and insert users FIRST
    console.log('Inserting users...');
    const hashedUsers = await Promise.all(
        sampleUsers.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, 10)
        }))
    );
    const users = await User.insertMany(hashedUsers);

    // Get admin user and create songs with uploader info
    const adminUser = users.find(user => user.role === 'admin');
    const songsWithUploader = sampleSongs.map(song => ({
        ...song,
        uploadedBy: adminUser._id,
        uploadedByUsername: adminUser.userName
    }));

    // Insert songs
    console.log('Inserting songs...');
    const songs = await Song.insertMany(songsWithUploader);

    res.json({
      success: true,
      message: 'Data seeded successfully to Atlas database!',
      data: {
        chords: chords.length,
        songs: songs.length,
        users: users.length
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.stack
    });
  }
});

module.exports = router;