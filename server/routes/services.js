// server/routes/services.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // <-- এই লাইনটা জরুরি

const Service = require('../models/Service');
const User = require('../models/User');

// --- Create a New Service Endpoint ---
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'PROVIDER') {
      return res.status(403).json({ msg: 'Access denied. Only providers can create services.' });
    }

    const { title, description, category, price, address } = req.body;

    const newService = new Service({
      provider: req.user.id,
      title,
      description,
      category,
      price,
      address,
    });

    const service = await newService.save();
    res.status(201).json(service);

  } catch (err) {
    console.error(`Error in POST /api/services: ${err.message}`);
    res.status(500).send('Server Error');
  }
});

// --- Get All Services Endpoint ---
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('provider', 'name');
    res.json(services);
  } catch (err) {
    console.error(`Error in GET /api/services: ${err.message}`);
    res.status(500).send('Server Error');
  }
});

module.exports = router;