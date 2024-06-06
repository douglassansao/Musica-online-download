const express = require('express');
const router = express.Router();
const Album = require('../models/album');

router.get('/', async (req, res) => {
    try {
        const albums = await Album.find().populate('tracks');
        res.json(albums);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add more album routes as needed

module.exports = router;
