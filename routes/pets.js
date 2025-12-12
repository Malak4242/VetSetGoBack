const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pet = require('../models/pet');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// =======================
// Ensure uploads directory exists
// =======================
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =======================
// Multer setup for images
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // relative to server root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// =======================
// Serve uploaded images statically
// =======================

// =======================
// POST /api/pets — Create a new pet
// =======================
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

// =======================
// GET /api/pets — Get all pets for the logged-in user
// =======================
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user }).sort({ createdAt: -1 });
    res.status(200).json(pets || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// =======================
// POST /api/pets/upload-image — Upload or change pet image (SECURE)
// =======================
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ error: 'petId is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Update only if pet exists AND belongs to the logged-in user
    const pet = await Pet.findOneAndUpdate(
      { _id: petId, owner: req.user },
      { img: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found or access denied' });
    }

    res.json({ imageUrl: pet.img });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;