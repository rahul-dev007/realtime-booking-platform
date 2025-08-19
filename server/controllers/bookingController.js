const Booking = require('../models/Booking');
const Service = require('../models/Service');

// তোমার আগের createBooking ফাংশন (এটা পারফেক্ট আছে)
exports.createBooking = async (req, res) => {
  const { serviceId, date } = req.body;
  const userId = req.user.id; // এটা আমরা authMiddleware থেকে পাবো

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    const existingBooking = await Booking.findOne({ service: serviceId, user: userId, date });
    if (existingBooking) {
      return res.status(400).json({ msg: 'You have already booked this service for this date' });
    }

    if (service.provider.toString() === userId) {
        return res.status(400).json({ msg: "You cannot book your own service" });
    }

    const newBooking = new Booking({
      service: serviceId,
      user: userId,
      provider: service.provider,
      date,
    });

    await newBooking.save();

    res.status(201).json({ msg: 'Booking successful! You will be notified once the provider confirms.', booking: newBooking });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Get bookings made by a specific user (আমার বুকিংগুলো)
// @route   GET /api/bookings/my-bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('service', 'title price')
      .populate('provider', 'name')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Get bookings received by a provider (বুকিং রিকোয়েস্ট)
// @route   GET /api/bookings/provider-bookings
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user.id })
      .populate('service', 'title')
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (err) { // <-- এখানকার ফরম্যাটিং ঠিক করে দিয়েছি
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// --- বুকিং স্ট্যাটাস আপডেট করার জন্য নতুন ফাংশন ---

// @desc    Update booking status
// @route   PUT /api/bookings/:bookingId/status
// @access  Private (Provider of the service only)
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body; // New status: 'confirmed' or 'cancelled'
  const { bookingId } = req.params;
  const providerId = req.user.id;

  // স্ট্যাটাস ভ্যালিড কিনা চেক করি
  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status update' });
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // যে প্রোভাইডার এই বুকিং পেয়েছে, শুধু সেই এটা পরিবর্তন করতে পারবে
    if (booking.provider.toString() !== providerId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // স্ট্যাটাস যদি পেন্ডিং না থাকে, তাহলে পরিবর্তন করা যাবে না
    if (booking.status !== 'pending') {
      return res.status(400).json({ msg: `Booking is already ${booking.status}` });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};