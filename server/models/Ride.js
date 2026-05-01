
const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: {
    name:        { type: String, required: true },
    coordinates: { lat: Number, lng: Number }
  },
  to: {
    name:        { type: String, required: true },
    coordinates: { lat: Number, lng: Number }
  },
  departureTime:  { type: Date,   required: true },
  totalSeats:     { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  pricePerSeat:   { type: Number, required: true },
  distanceKm:     { type: Number, default: 0 },
  womenOnly:      { type: Boolean, default: false },
  riders: [{
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupPoint:  { name: String, coordinates: { lat: Number, lng: Number } },
    dropPoint:    { name: String, coordinates: { lat: Number, lng: Number } },
    distanceKm:   { type: Number, default: 0 },
    fare:         { type: Number, default: 0 },
    status:       { type: String, enum: ['pending','confirmed','completed'], default: 'pending' }
  }],
  status: {
    type: String,
    enum: ['upcoming','ongoing','completed','cancelled'],
    default: 'upcoming'
  },
  co2Saved: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);