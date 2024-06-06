const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    genre: { type: String, required: true },
    filePath: { type: String, required: true }
});

module.exports = mongoose.model('Music', musicSchema);
