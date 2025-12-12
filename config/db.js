// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGO_URI;
//     await mongoose.connect(uri);
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri); // مفيش حاجة زيادة
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

