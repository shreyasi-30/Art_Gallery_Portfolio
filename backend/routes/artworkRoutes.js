const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.get('/', artworkController.getAllArtworks);
router.get('/:id', artworkController.getArtwork);
router.post('/', authMiddleware, upload.single('image'), artworkController.uploadArtwork);
router.get('/user/my-artworks', authMiddleware, artworkController.getUserArtworks);
router.delete('/:id', authMiddleware, artworkController.deleteArtwork);

module.exports = router;