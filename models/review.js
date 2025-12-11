// const mongoose = require('mongoose');

// const ReviewSchema = new mongoose.Schema({
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
//   },
//   appointment: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Appointment', 
//     required: true 
//   },
//   hospital: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Hospital', 
//     required: true 
//   },
//   doctor: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Doctor', 
//     required: true 
//   },
//   rating: { 
//     type: Number, 
//     required: true, 
//     min: 1, 
//     max: 5 
//   },
//   comment: { 
//     type: String, 
//     required: true 
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// module.exports = mongoose.model('Review', ReviewSchema);

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment', 
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
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  versionKey: false // لإزالة __v من المستندات لو مش محتاجاه
});

module.exports = mongoose.model('Review', ReviewSchema);
