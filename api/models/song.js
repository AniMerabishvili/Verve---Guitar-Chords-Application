const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lyrics: { type: String, required: true },
    status: { type: Number, required: true, default: 0 }, // Changed default to 0 (pending)
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add user reference
    uploadedByUsername: { type: String, required: true } // Add username for easy display
}, {
    collection: 'songs',
    timestamps: true,
    read: 'nearest',
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    }
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;