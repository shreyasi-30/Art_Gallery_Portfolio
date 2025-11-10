const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Painting', 'Digital Art', 'Photography', 'Sculpture', 'Mixed Media', 'Other'],
  },
  medium: {
    type: String,
  },
  dimensions: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  isForSale: {
    type: Boolean,
    default: false,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  views: {
    type: Number,
    default: 0,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Artwork', ArtworkSchema);