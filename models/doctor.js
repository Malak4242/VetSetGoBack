const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  hospital: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital', 
    required: true 
  },
  specialization: { 
    type: String, 
    required: true 
  }, // e.g., 'Veterinary Surgeon', 'General Practitioner'
  experience: { 
    type: Number 
  }, // Years of experience
  phone: { 
    type: String 
  },
  email: { 
    type: String 
  },
  availableDays: [{ 
    type: String 
  }], // ['Monday', 'Tuesday', 'Wednesday']
  availableTimeSlots: [{ 
    type: String 
  }], // ['09:00', '09:30', '10:00', ...]
  consultationFee: { 
    type: Number, 
    required: true 
  },
  rating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  image: { 
    type: String 
  },
  bio: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);