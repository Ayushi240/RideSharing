const router = require('express').Router();
const Ride   = require('../models/Ride');
const Review = require('../models/Review');
const User   = require('../models/User');
const auth   = require('../middleware/auth');

// ─────────────────────────────────────────────
// POST /api/bookings/review — submit a review
// ─────────────────────────────────────────────
router.post('/review', auth, async (req, res) => {
  try {
    const { rideId, revieweeId, rating, comment } = req.body;

    if (!rideId || !revieweeId || !rating)
      return res.status(400).json({ msg: 'rideId, revieweeId and rating are required' });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });

    // Check if already reviewed
    const existing = await Review.findOne({
      ride:     rideId,
      reviewer: req.user.id,
      reviewee: revieweeId
    });
    if (existing)
      return res.status(400).json({ msg: 'You already reviewed this person for this ride' });

    const review = await Review.create({
      ride:     rideId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment:  comment || ''
    });

    // Recalculate safety score — average of all ratings
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgScore   = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      safetyScore: parseFloat(avgScore.toFixed(1)),
      $push: { reviews: review._id }
    });

    res.json({ msg: 'Review submitted successfully!', review });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/bookings/fare-split/:rideId — fare split details
// ─────────────────────────────────────────────
router.get('/fare-split/:rideId', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('riders.user', 'name');

    if (!ride)
      return res.status(404).json({ msg: 'Ride not found' });

    const BASE   = 20;
    const PER_KM = 8;

    const splits = ride.riders.map(r => ({
      name:     r.user?.name || 'Rider',
      distance: r.distanceKm || ride.distanceKm,
      fare:     Math.round(BASE + (r.distanceKm || ride.distanceKm) * PER_KM),
    }));

    const totalDistance = splits.reduce((s, r) => s + r.distance, 0);

    res.json({
      splits,
      totalDistance,
      rideDistance: ride.distanceKm,
      co2Saved:     ride.co2Saved
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/bookings/my-bookings — all bookings by logged in user
// ─────────────────────────────────────────────
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const rides = await Ride.find({ 'riders.user': req.user.id })
      .populate('driver', 'name safetyScore vehicleDetails')
      .sort({ createdAt: -1 });

    const bookings = rides.map(ride => {
      const myRider = ride.riders.find(r => r.user.toString() === req.user.id);
      return {
        rideId:        ride._id,
        from:          ride.from.name,
        to:            ride.to.name,
        departureTime: ride.departureTime,
        driver:        ride.driver,
        status:        ride.status,
        myFare:        myRider?.fare || ride.pricePerSeat,
        riderStatus:   myRider?.status || 'confirmed'
      };
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;