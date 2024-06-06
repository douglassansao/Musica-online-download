const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');

// Get all genres
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new genre
router.post('/', async (req, res) => {
    const genre = new Genre({
        name: req.body.name
    });

    try {
        const newGenre = await genre.save();
        res.status(201).json(newGenre);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
