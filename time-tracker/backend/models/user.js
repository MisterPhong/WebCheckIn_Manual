const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  nickname: { type: String, required: true },
  loginTime: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
