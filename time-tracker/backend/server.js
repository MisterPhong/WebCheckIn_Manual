const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
