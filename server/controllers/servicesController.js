// server/controllers/servicesController.js (সম্পূর্ণ এবং সঠিক)

const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Get all services with Search, Filter & Pagination
exports.getAllServices = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? { title: { $regex: req.query.keyword, $options: 'i' } } : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const count = await Service.countDocuments({ ...keyword, ...category });
    const services = await Service.find({ ...keyword, ...category })
      .populate('provider', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });
    res.json({ services, page, pages: Math.ceil(count / pageSize) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single service by its ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name email');
    if (!service) return res.status(404).json({ msg: 'Service not found' });
    res.json(service);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Service not found' });
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new service
exports.createService = async (req, res) => {
  const { title, description, price, category, address } = req.body;
  try {
    const provider = await User.findById(req.user.id);
    if (provider.role !== 'PROVIDER') return res.status(403).json({ msg: 'Access denied' });
    const newService = new Service({ provider: req.user.id, title, description, price, category, address });
    const service = await newService.save();
    res.status(201).json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all services created by the logged-in provider
exports.getProviderServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user.id }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};