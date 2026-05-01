
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone:    { type: String, default: '' },
  avatar:   { type: String, default: '' },
  gender:   { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  safetyScore:  { type: Number, default: 5.0, min: 0, max: 5 },
  totalRides:   { type: Number, default: 0 },
  totalSaved:   { type: Number, default: 0 },   // money saved by sharing
  co2Saved:     { type: Number, default: 0 },   // kg of CO2 saved
  isVerified:   { type: Boolean, default: false },
  vehicleDetails: {
    model:       { type: String, default: '' },
    plateNumber: { type: String, default: '' },
    seats:       { type: Number, default: 4 },
    color:       { type: String, default: '' },
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);