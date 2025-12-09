const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/review');
const Appointment = require('../models/appointment');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

// Create review (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    
    if (!appointmentId || !rating || !comment) {
      return res.status(400).json({ msg: 'Please provide all fields' });
    }
    
    // Check if appointment exists and belongs to user
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user: req.user,
      status: 'completed'
    });
    
    if (!appointment) {
      return res.status(404).json({ 
        msg: 'Appointment not found or not completed' 
      });
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({ 
      appointment: appointmentId 
    });
    
    if (existingReview) {
      return res.status(400).json({ msg: 'Review already submitted' });
    }
    
    // Create review
    const review = new Review({
      user: req.user,
      appointment: appointmentId,
      hospital: appointment.hospital,
      doctor: appointment.doctor,
      rating,
      comment
    });
    
    await review.save();
    
    // Update hospital and doctor ratings (simplified average)
    await updateRatings(appointment.hospital, appointment.doctor);
    
    await review.populate('user', 'name');
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get reviews for a hospital
router.get('/hospital/:hospitalId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      hospital: req.params.hospitalId 
    })
      .populate('user', 'name')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Helper function to update ratings
async function updateRatings(hospitalId, doctorId) {
  // Update hospital rating
  const hospitalReviews = await Review.find({ hospital: hospitalId });
  if (hospitalReviews.length > 0) {
    const avgRating = hospitalReviews.reduce((sum, r) => sum + r.rating, 0) / hospitalReviews.length;
    await Hospital.findByIdAndUpdate(hospitalId, { 
      rating: Math.round(avgRating * 10) / 10 
    });
  }
  
  // Update doctor rating
  const doctorReviews = await Review.find({ doctor: doctorId });
  if (doctorReviews.length > 0) {
    const avgRating = doctorReviews.reduce((sum, r) => sum + r.rating, 0) / doctorReviews.length;
    await Doctor.findByIdAndUpdate(doctorId, { 
      rating: Math.round(avgRating * 10) / 10 
    });
  }
}

module.exports = router;