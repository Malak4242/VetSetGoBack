require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('./models/hospital');

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update each hospital with an image
    await Hospital.findOneAndUpdate(
      { name: 'Happy Paws Veterinary Clinic' },
      { image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80' }
    );

    await Hospital.findOneAndUpdate(
      { name: 'Pet Care Emergency Hospital' },
      { image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&q=80" }
    );

    await Hospital.findOneAndUpdate(
      { name: 'Animal Wellness Center' },
      { image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80' }
    );

    console.log('✅ Images updated successfully');

    // Verify the update
    const hospitals = await Hospital.find();
    hospitals.forEach(h => {
      console.log(`${h.name}: ${h.image || 'NO IMAGE'}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

updateImages();