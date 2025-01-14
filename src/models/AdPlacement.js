const mongoose = require('mongoose');

const AdPlacementSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Reklam konumu belirtilmelidir'],
    enum: ['header', 'sidebar', 'content', 'footer'], // Belirli alanlar
  },
  code: {
    type: String,
    required: [true, 'Reklam kodu gereklidir'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdPlacement', AdPlacementSchema);
