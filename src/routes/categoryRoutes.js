const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const router = express.Router();

router.post('/', protect, createCategory);
router.get('/', getCategories);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
