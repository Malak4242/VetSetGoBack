const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pet = require('../models/pet');

// POST /api/pets — Create a new pet
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, breed, age, gender, notes } = req.body;

    if (!name || !type) {
      return res.status(400).json({ msg: 'Name and Type are required' });
    }

    const pet = new Pet({
      name,
      type,
      breed,
      age: age ? Number(age) : undefined,
      gender,
      notes,
      owner: req.user
    });

    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/pets — Get all pets for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user }).sort({ createdAt: -1 });
    // Always return JSON array, even if empty
    res.status(200).json(pets || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
