const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Pet = require('../models/pet');

// Create appointment (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { 
      petId, 
      hospitalId, 
      doctorId, 
      appointmentDate, 
      timeSlot, 
      reason, 
      symptoms 
    } = req.body;
    
    // Validate required fields
    if (!petId || !hospitalId || !doctorId || !appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    
    // Check if pet belongs to user
    const pet = await Pet.findOne({ _id: petId, owner: req.user });
    if (!pet) {
      return res.status(404).json({ msg: 'Pet not found or does not belong to you' });
    }
    
    // Get doctor info for consultation fee
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    
    // Check if time slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot: timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ msg: 'This time slot is already booked' });
    }
    
    // Create appointment
    const appointment = new Appointment({
      user: req.user,
      pet: petId,
      hospital: hospitalId,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reason,
      symptoms,
      totalFee: doctor.consultationFee,
      status: 'pending'
    });
    
    await appointment.save();
    
    // Populate the response
    await appointment.populate([
      { path: 'pet', select: 'name type age' },
      { path: 'hospital', select: 'name address phone' },
      { path: 'doctor', select: 'name specialization consultationFee' }
    ]);
    
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's appointments (Protected)
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user };
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate('pet', 'name type age')
      .populate('hospital', 'name address phone')
      .populate('doctor', 'name specialization consultationFee')
      .sort({ appointmentDate: -1 });
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get appointment by ID (Protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user
    })
      .populate('pet', 'name type age')
      .populate('hospital', 'name address phone email')
      .populate('doctor', 'name specialization consultationFee phone email')
      .populate('user', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update appointment status (Protected)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user
    });
    
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    
    // Can only cancel pending or confirmed appointments
    if (!['pending', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({ msg: 'Cannot cancel this appointment' });
    }
    
    appointment.status = status;
    await appointment.save();
    
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/doctor/:doctorId/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ msg: 'Date is required' });
    }
    
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    
    // Get booked appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctor: req.params.doctorId,
      appointmentDate: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');
    
    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);
    
    // Filter out booked slots
    const availableSlots = doctor.availableTimeSlots.filter(
      slot => !bookedSlots.includes(slot)
    );
    
    res.json({
      date,
      availableSlots,
      bookedSlots,
      allSlots: doctor.availableTimeSlots
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;