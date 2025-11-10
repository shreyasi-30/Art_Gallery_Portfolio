const Artwork = require('../models/Artwork');
const cloudinary = require('../config/cloudinary');

exports.uploadArtwork = async (req, res) => {
  try {
    const { title, description, category, medium, dimensions, price, isForSale, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'artworks',
      width: 1200,
      crop: 'limit',
    });

    const artwork = new Artwork({
      title,
      description,
      imageUrl: result.secure_url,
      category,
      medium,
      dimensions,
      price: price || 0,
      isForSale: isForSale || false,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      artist: req.userId,
    });

    await artwork.save();
    res.status(201).json(artwork);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .populate('artist', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.userId })
      .sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artist', 'name email profileImage bio website socialLinks');
    
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    artwork.views += 1;
    await artwork.save();

    res.json(artwork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    if (artwork.artist.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await artwork.deleteOne();
    res.json({ message: 'Artwork deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};