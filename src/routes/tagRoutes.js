const express = require('express');
const router = express.Router();
const {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
} = require('../controllers/tagController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Public
router.get('/', getTags);
router.get('/:id', getTag);

// Admin - Protected
router.post('/', protect, isAdmin, createTag);
router.put('/:id', protect, isAdmin, updateTag);
router.delete('/:id', protect, isAdmin, deleteTag);

module.exports = router;
