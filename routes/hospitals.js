// routes/hospitals.js
const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const { specialty, search } = req.query;
    let query = { isActive: true };
    
    if (specialty) {
      query.specialties = specialty;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    const hospitals = await Hospital.find(query).sort({ rating: -1 });
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get hospital by ID with doctors
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }
    
    const doctors = await Doctor.find({ 
      hospital: req.params.id, 
      isActive: true 
    });
    
    res.json({ hospital, doctors });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get doctors by hospital
router.get('/:id/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({ 
      hospital: req.params.id, 
      isActive: true 
    }).populate('hospital', 'name address');
    
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;