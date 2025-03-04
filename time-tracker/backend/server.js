const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user'); // import user routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // เพื่อให้ backend สามารถรับข้อมูล JSON

// ใช้ route สำหรับ user
app.use('/api/user', userRoutes);

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// สตาร์ทเซิร์ฟเวอร์
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
