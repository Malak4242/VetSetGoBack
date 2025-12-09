const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pet = require('../models/pet');

// Register pet
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, age, notes } = req.body;
    const pet = new Pet({ name, type, age, notes, owner: req.user });
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get user's pets
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
