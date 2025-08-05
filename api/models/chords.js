const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const chordSchema = new mongoose.Schema ({
    chordName: { type: String, required: true }
}, {
    collection: 'chords',
    timestamps: true,
    read: 'nearest',
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    }
});

const Chord = mongoose.model('Chord', chordSchema);
module.exports = Chord;