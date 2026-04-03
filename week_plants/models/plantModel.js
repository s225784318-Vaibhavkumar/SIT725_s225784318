const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['flowering', 'succulent', 'herb', 'foliage', 'tree', 'shrub']
  },
  price: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: 'AUD'
  },
  wateringFrequency: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly']
  },
  sunlight: {
    type: String,
    required: true,
    enum: ['full sun', 'partial shade', 'full shade']
  },
  height: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plant', plantSchema);
