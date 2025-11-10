const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, website, instagram, twitter, facebook } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.website = website || user.website;
    user.socialLinks = {
      instagram: instagram || user.socialLinks?.instagram || '',
      twitter: twitter || user.socialLinks?.twitter || '',
      facebook: facebook || user.socialLinks?.facebook || '',
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profiles',
        width: 400,
        height: 400,
        crop: 'fill',
      });
      user.profileImage = result.secure_url;
    }

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      website: user.website,
      socialLinks: user.socialLinks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};