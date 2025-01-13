const express = require('express');
const { createContent, getContents, getContentById, updateContent, deleteContent } = require('../controllers/contentController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, createContent);
router.get('/', getContents);
router.get('/:id', getContentById);
router.put('/:id', protect, updateContent);
router.delete('/:id', protect, deleteContent);

module.exports = router;
