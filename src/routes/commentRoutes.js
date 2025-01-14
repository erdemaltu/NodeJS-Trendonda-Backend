const express = require('express');
const { addComment, getCommentsByContent, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, addComment);
router.get('/:contentId', getCommentsByContent);
router.delete('/:id', protect, deleteComment);

module.exports = router;
