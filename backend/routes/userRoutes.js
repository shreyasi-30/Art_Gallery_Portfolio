const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload.single('profileImage'), userController.updateProfile);

module.exports = router;