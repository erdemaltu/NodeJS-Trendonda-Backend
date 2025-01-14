const express = require('express');
const {
  createContent,
  getAllContents,
  getContentById,
  updateContent,
  deleteContent,
} = require('../controllers/contentController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// İçerik oluşturma (Admin yetkisi)
router.post('/', protect, isAdmin, createContent);

// Tüm içerikleri listeleme
router.get('/', getAllContents);

// Tek bir içerik getirme
router.get('/:id', getContentById);

// İçerik güncelleme (Admin yetkisi)
router.put('/:id', protect, isAdmin, updateContent);

// İçerik silme (Admin yetkisi)
router.delete('/:id', protect, isAdmin, deleteContent);

module.exports = router;
