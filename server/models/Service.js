// server/models/Service.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  // 1. এই সার্ভিসটা কোন প্রোভাইডার দিচ্ছে?
  // আমরা এখানে User মডেলের সাথে একটা সম্পর্ক তৈরি করছি।
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User', // এটা 'User' মডেলকে নির্দেশ করছে
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    // ভবিষ্যতে আমরা এখানে ক্যাটাগরি ফিক্স করে দিতে পারি (e.g., enum: ['Salon', 'Doctor'])
  },
  price: {
    type: Number,
    required: true,
  },
  // 2. গুগল ম্যাপের জন্য সবচেয়ে গুরুত্বপূর্ণ অংশ
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON টাইপ
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude] - এই অর্ডারে হবে
      required: true,
    },
  },
}, {
  timestamps: true,
});

// 3. লোকেশন ভিত্তিক সার্চ দ্রুত করার জন্য একটা 2dsphere index তৈরি করা
ServiceSchema.index({ location: '2dsphere' });

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;