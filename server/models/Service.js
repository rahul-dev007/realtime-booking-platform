// server/models/Service.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  
  // --- লোকেশন সেকশনটা পুরোপুরি বদলে যাবে ---

  // ১. ঠিকানার জন্য একটা সাধারণ স্ট্রিং ফিল্ড
  address: {
    type: String,
  },

  // ২. শুধুমাত্র ম্যাপের কোঅর্ডিনেটসের জন্য একটা আলাদা জিও-অবজেক্ট
  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  // ------------------------------------
}, {
  timestamps: true,
});

// আমরা এখন স্পেশাল ইনডেক্সটা শুধুমাত্র geoLocation ফিল্ডের উপর বানাবো
ServiceSchema.index({ geoLocation: '2dsphere' });

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;