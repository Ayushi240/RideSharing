
const router = require('express').Router();
const Ride   = require('../models/Ride');
const User   = require('../models/User');
const auth   = require('../middleware/auth');

// ── Haversine formula — distance in km between two GPS points ──
function getDistance(c1, c2) {
  const R    = 6371;
  const dLat = (c2.lat - c1.lat) * Math.PI / 180;
  const dLon = (c2.lng - c1.lng) * Math.PI / 180;
  const a    = Math.sin(dLat / 2) ** 2 +
    Math.cos(c1.lat * Math.PI / 180) *
    Math.cos(c2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Price estimation ──
function estimatePrice(distanceKm) {
  const BASE = 20, PER_KM = 8;
  return Math.round(BASE + distanceKm * PER_KM);
}

// ── CO2 saved calculation ──
function calcCO2Saved(distanceKm, numRiders) {
  return parseFloat((0.21 * distanceKm * (numRiders - 1)).toFixed(2));
}

// ─────────────────────────────────────────────
// GET /api/rides — all upcoming rides
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'upcoming' })
      .populate('driver', 'name safetyScore gender vehicleDetails')
      .sort({ departureTime: 1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/rides/my — rides offered or booked by logged in user
// ─────────────────────────────────────────────
router.get('/my', auth, async (req, res) => {
  try {
    const offered = await Ride.find({ driver: req.user.id })
      .populate('driver', 'name safetyScore')
      .sort({ createdAt: -1 });

    const booked = await Ride.find({ 'riders.user': req.user.id })
      .populate('driver', 'name safetyScore')
      .sort({ createdAt: -1 });

    res.json({ offered, booked });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/rides/offer — offer a new ride
// ─────────────────────────────────────────────
router.post('/offer', auth, async (req, res) => {
  try {
    const { from, to, departureTime, totalSeats, distanceKm, womenOnly } = req.body;

    if (!from || !to || !departureTime || !totalSeats || !distanceKm)
      return res.status(400).json({ msg: 'Please fill all required fields' });

    const pricePerSeat = estimatePrice(distanceKm);

    const ride = await Ride.create({
      driver:         req.user.id,
      from,
      to,
      departureTime,
      totalSeats,
      availableSeats: totalSeats,
      pricePerSeat,
      distanceKm,
      womenOnly:      womenOnly || false,
    });

    await ride.populate('driver', 'name safetyScore vehicleDetails');
    res.json(ride);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/rides/match — AI smart matching
// ─────────────────────────────────────────────
router.post('/match', async (req, res) => {
  try {
    const { from, to, womenOnly } = req.body;

    if (!from || !to)
      return res.status(400).json({ msg: 'From and To coordinates required' });

    let query = { status: 'upcoming', availableSeats: { $gt: 0 } };
    if (womenOnly) query.womenOnly = true;

    const all = await Ride.find(query)
      .populate('driver', 'name safetyScore gender avatar vehicleDetails');

    // Filter rides within 2km of user pickup & drop
    const matched = all.filter(ride => {
      if (!ride.from?.coordinates || !ride.to?.coordinates) return false;
      const pickupClose = getDistance(from, ride.from.coordinates) < 2;
      const dropClose   = getDistance(to,   ride.to.coordinates)   < 2;
      return pickupClose && dropClose;
    });

    // Sort by safety score — highest first
    matched.sort((a, b) => b.driver.safetyScore - a.driver.safetyScore);

    res.json(matched);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/rides/book/:id — book a seat
// ─────────────────────────────────────────────
router.post('/book/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride)
      return res.status(404).json({ msg: 'Ride not found' });
    if (ride.availableSeats < 1)
      return res.status(400).json({ msg: 'No seats available' });
    if (ride.driver.toString() === req.user.id)
      return res.status(400).json({ msg: 'You cannot book your own ride' });

    const alreadyBooked = ride.riders.find(r => r.user.toString() === req.user.id);
    if (alreadyBooked)
      return res.status(400).json({ msg: 'You already booked this ride' });

    const riderDistance = req.body.riderDistance || ride.distanceKm;
    const fare          = estimatePrice(riderDistance);

    ride.riders.push({
      user:       req.user.id,
      distanceKm: riderDistance,
      fare,
      status:     'confirmed'
    });
    ride.availableSeats -= 1;
    ride.co2Saved        = calcCO2Saved(ride.distanceKm, ride.riders.length + 1);
    await ride.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalRides: 1, totalSaved: (ride.pricePerSeat - fare) }
    });

    res.json({ msg: 'Seat booked successfully!', fare, ride });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/rides/:id — single ride details
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name safetyScore gender vehicleDetails phone')
      .populate('riders.user', 'name safetyScore');
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────────
// PUT /api/rides/:id/status — update ride status
// ─────────────────────────────────────────────
router.put('/:id/status', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride)
      return res.status(404).json({ msg: 'Ride not found' });
    if (ride.driver.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not authorized' });

    ride.status = req.body.status;
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;