const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  pet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet', 
    required: true 
  },
  hospital: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  appointmentDate: { 
    type: Date, 
    required: true 
  },
  timeSlot: { 
    type: String, 
    required: true 
  }, // e.g., '09:00', '14:30'
  reason: { 
    type: String, 
    required: true 
  }, // Reason for visit
  symptoms: { 
    type: String 
  }, // Detailed symptoms
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending' 
  },
  notes: { 
    type: String 
  }, // Doctor's notes (filled after appointment)
  prescription: { 
    type: String 
  }, // Prescription details
  totalFee: { 
    type: Number, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending' 
  },
  reminderSent: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt timestamp before saving
AppointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);