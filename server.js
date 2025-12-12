// server.js
require('dotenv').config();
const express = require('express');
// Serve uploaded files statically at root level
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// FIXED CORS
app.use(cors({
  origin: [
    'http://localhost:5175',   // <-- remove trailing slash
    'https://vetsetgo.vercel.app',
    'https://vet-set-go2-x42r.vercel.app'
  ]
}));

app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Pet routes
app.use('/api/pets', require('./routes/pets'));

// Hospital & Appointment routes (NEW)
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check
app.get('/', (req, res) => res.send('Pet Forum API - v2.0 with Appointments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Available endpoints:');
      console.log('  - POST /api/auth/register');
      console.log('  - POST /api/auth/login');
      console.log('  - GET  /api/auth/me');
      console.log('  - GET  /api/pets');
      console.log('  - POST /api/pets');
      console.log('  - GET  /api/hospitals');
      console.log('  - GET  /api/hospitals/:id');
      console.log('  - POST /api/appointments');
      console.log('  - GET  /api/appointments/my-appointments');
      console.log('  - GET  /api/appointments/doctor/:id/available-slots');
      console.log('  - POST /api/reviews');
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });