const mongoose = require('mongoose');
const Chord = require('./models/chords');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/GuitarChords')
  .then(() => {
    console.log('Connected to MongoDB');
    return addChords();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

async function addChords() {
  try {
    // Check if chords already exist
    const existingChords = await Chord.find({ chordName: { $in: ['C', 'Am'] } });
    
    if (existingChords.length > 0) {
      console.log('Chords already exist:', existingChords.map(c => c.chordName));
      return;
    }

    // Add the chords
    const chordsToAdd = [
      { chordName: 'C' },
      { chordName: 'Am' }
    ];

    const result = await Chord.insertMany(chordsToAdd);
    console.log('Successfully added chords:', result.map(c => c.chordName));
    
    // Show all chords in the database
    const allChords = await Chord.find().sort({ chordName: 1 });
    console.log('\nAll chords in database:');
    allChords.forEach(chord => {
      console.log(`- ${chord.chordName}`);
    });

  } catch (error) {
    console.error('Error adding chords:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
} 