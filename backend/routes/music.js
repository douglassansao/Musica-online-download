const express = require('express');
const router = express.Router();
const Music = require('../models/music');

router.get('/', async (req, res) => {
    try {
        const music = await Music.find();
        res.json(music);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add more music routes as needed

module.exports = router;
