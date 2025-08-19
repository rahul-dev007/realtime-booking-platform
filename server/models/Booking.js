// server/models/Booking.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
  // কোন সার্ভিসটা বুক করা হয়েছে?
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  // কোন ইউজার বুক করেছে?
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // কোন প্রোভাইডারের সার্ভিস?
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // কোন তারিখে বুক করা হয়েছে?
  date: {
    type: Date,
    required: true,
  },
  // বুকিং-এর বর্তমান অবস্থা কী?
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;