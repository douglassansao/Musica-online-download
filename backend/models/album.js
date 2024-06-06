const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    coverImage: {
        type: String
    }
});

const Album = mongoose.model('Album', albumSchema);
module.exports = Album;
