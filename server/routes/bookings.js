const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// 1. কন্ট্রোলার থেকে আমাদের updateBookingStatus ফাংশনটিও নিয়ে আসি
const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus // <-- নিশ্চিত করো যে এই লাইনটি এখানে আছে
} = require('../controllers/bookingController');

// --- Create a New Booking Endpoint ---
// URL: POST /api/bookings
router.post('/', authMiddleware, createBooking);

// --- Get Bookings for the Logged-in User ---
// URL: GET /api/bookings/my-bookings
router.get('/my-bookings', authMiddleware, getUserBookings);

// --- Get Booking Requests for the Logged-in Provider ---
// URL: GET /api/bookings/provider-bookings
router.get('/provider-bookings', authMiddleware, getProviderBookings);

// --- Update Booking Status Endpoint (এই অংশটাই সম্ভবত মিসিং ছিল) ---
// URL: PUT /api/bookings/:bookingId/status
router.put('/:bookingId/status', authMiddleware, updateBookingStatus); // <-- এই লাইনটি সবচেয়ে গুরুত্বপূর্ণ

module.exports = router;