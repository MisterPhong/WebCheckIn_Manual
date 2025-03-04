// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // ไม่ต้องใช้ options อีกแล้ว
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // หากการเชื่อมต่อล้มเหลว ให้หยุด server
  }
};

module.exports = connectDB;
