// server/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // প্রতিটা ইমেইল ইউনিক হবে
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['USER', 'PROVIDER'], // শুধুমাত্র এই দুটো ভ্যালুই হতে পারবে
    default: 'USER', // ডিফল্টভাবে সবাই USER
  },
  // ভবিষ্যতে আমরা এখানে আরও ফিল্ড যোগ করবো (যেমন: address, profilePicture)
}, {
  timestamps: true, // createdAt এবং updatedAt ফিল্ড অটোমেটিক তৈরি হবে
});

const User = mongoose.model('User', UserSchema);

module.exports = User;