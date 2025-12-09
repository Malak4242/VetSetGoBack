// scripts/seedHospitals.js
// Run this to populate your database with sample hospitals and doctors
// Usage: node scripts/seedHospitals.js

require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const sampleHospitals = [
  {
    name: "Happy Paws Veterinary Clinic",
    address: "123 Main Street, Cairo, Egypt",
    phone: "+20 2 1234 5678",
    email: "info@happypaws.com",
    specialties: ["General Care", "Surgery", "Dental", "Vaccination"],
    workingHours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "15:00" },
      saturday: { open: "10:00", close: "14:00" },
      sunday: { open: null, close: null }
    },
    rating: 4.5,
    description: "Full-service veterinary clinic providing comprehensive care for your pets.",
    isActive: true
  },
  {
    name: "Pet Care Emergency Hospital",
    address: "456 Nile Avenue, Cairo, Egypt",
    phone: "+20 2 9876 5432",
    email: "emergency@petcare.com",
    specialties: ["Emergency", "Critical Care", "Surgery", "X-Ray"],
    workingHours: {
      monday: { open: "00:00", close: "23:59" },
      tuesday: { open: "00:00", close: "23:59" },
      wednesday: { open: "00:00", close: "23:59" },
      thursday: { open: "00:00", close: "23:59" },
      friday: { open: "00:00", close: "23:59" },
      saturday: { open: "00:00", close: "23:59" },
      sunday: { open: "00:00", close: "23:59" }
    },
    rating: 4.8,
    description: "24/7 emergency veterinary services with experienced specialists.",
    isActive: true
  },
  {
    name: "Animal Wellness Center",
    address: "789 Garden City, Cairo, Egypt",
    phone: "+20 2 5555 7777",
    email: "contact@animalwellness.com",
    specialties: ["General Care", "Grooming", "Nutrition", "Behavioral"],
    workingHours: {
      monday: { open: "08:00", close: "17:00" },
      tuesday: { open: "08:00", close: "17:00" },
      wednesday: { open: "08:00", close: "17:00" },
      thursday: { open: "08:00", close: "17:00" },
      friday: { open: "08:00", close: "14:00" },
      saturday: { open: "09:00", close: "13:00" },
      sunday: { open: null, close: null }
    },
    rating: 4.3,
    description: "Holistic approach to pet healthcare and wellness.",
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing hospitals and doctors...');
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    
    // Insert hospitals
    console.log('Inserting sample hospitals...');
    const hospitals = await Hospital.insertMany(sampleHospitals);
    console.log(`✓ ${hospitals.length} hospitals created`);
    
    // Create doctors for each hospital
    console.log('Creating sample doctors...');
    const doctors = [];
    
    for (const hospital of hospitals) {
      // Create 3 doctors per hospital
      const hospitalDoctors = [
        {
          name: `Dr. Ahmed Hassan`,
          hospital: hospital._id,
          specialization: "General Practitioner",
          experience: 10,
          phone: "+20 100 123 4567",
          email: `ahmed@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
          availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
          availableTimeSlots: [
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
          ],
          consultationFee: 200,
          rating: 4.6,
          bio: "Experienced veterinarian with a passion for animal care.",
          isActive: true
        },
        {
          name: `Dr. Fatima Ali`,
          hospital: hospital._id,
          specialization: "Veterinary Surgeon",
          experience: 8,
          phone: "+20 101 234 5678",
          email: `fatima@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
          availableDays: ["Monday", "Wednesday", "Thursday", "Friday"],
          availableTimeSlots: [
            "10:00", "10:30", "11:00", "11:30", "12:00",
            "14:00", "14:30", "15:00", "15:30", "16:00"
          ],
          consultationFee: 300,
          rating: 4.8,
          bio: "Specialist in surgical procedures and post-operative care.",
          isActive: true
        },
        {
          name: `Dr. Mohamed Ibrahim`,
          hospital: hospital._id,
          specialization: "Emergency Specialist",
          experience: 12,
          phone: "+20 102 345 6789",
          email: `mohamed@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
          availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          availableTimeSlots: [
            "09:00", "09:30", "10:00", "10:30", "11:00",
            "13:00", "13:30", "14:00", "14:30", "15:00"
          ],
          consultationFee: 250,
          rating: 4.7,
          bio: "Expert in emergency care and critical situations.",
          isActive: true
        }
      ];
      
      doctors.push(...hospitalDoctors);
    }
    
    await Doctor.insertMany(doctors);
    console.log(`✓ ${doctors.length} doctors created`);
    
    console.log('\n✅ Database seeded successfully!');
    console.log(`Total hospitals: ${hospitals.length}`);
    console.log(`Total doctors: ${doctors.length}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();