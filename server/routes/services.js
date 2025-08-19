// server/routes/services.js (সম্পূর্ণ নতুন এবং সঠিক)

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// 1. কন্ট্রোলার থেকে সব প্রয়োজনীয় ফাংশন নিয়ে আসি
const {
  getAllServices,
  getServiceById,
  createService,
  getProviderServices
} = require('../controllers/servicesController');

// --- রুটের সঠিক ক্রম ---

// রুট: GET /api/services
// কাজ: সব সার্ভিস দেখানো (সার্চ, ফিল্টার সহ)
router.get('/', getAllServices);

// রুট: GET /api/services/my-services
// কাজ: প্রোভাইডারের নিজের সার্ভিস দেখানো
// *** এটাকে /:id এর আগে রাখা হয়েছে ***
router.get('/my-services', authMiddleware, getProviderServices);

// রুট: POST /api/services
// কাজ: নতুন সার্ভিস তৈরি করা
router.post('/', authMiddleware, createService);

// রুট: GET /api/services/:id
// কাজ: একটি নির্দিষ্ট সার্ভিস দেখানো
// *** এটাকে সব শেষে রাখা হয়েছে ***
router.get('/:id', getServiceById);

module.exports = router;