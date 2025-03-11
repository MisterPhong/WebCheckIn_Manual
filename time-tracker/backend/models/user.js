const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  nickname: { type: String, required: true },
  loginTime: { type: Date, required: true },
  status: { type: String, required: true },
  logoutTime: { type: Date },
}, { versionKey: false });

const User = mongoose.model('User', userSchema);
module.exports = User;
