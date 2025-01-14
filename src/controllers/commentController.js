const Comment = require('../models/Comment');

// Yorum Ekle
const addComment = async (req, res, next) => {
  try {
    const { contentId, text } = req.body;

    const newComment = new Comment({
      contentId,
      userId: req.user._id,
      text,
    });

    await newComment.save();

    res.status(201).json({ message: 'Yorum başarıyla eklendi', comment: newComment });
  } catch (error) {
    next(error);
  }
};

// Yorumları Listele
const getCommentsByContent = async (req, res, next) => {
  try {
    const { contentId } = req.params;

    const comments = await Comment.find({ contentId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

// Yorum Sil
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }

    // Admin veya Yorumu Yapan Kullanıcı Kontrolü
    if (req.user.role !== 'admin' && comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu yorumu silmek için yetkiniz yok' });
    }

    await comment.deleteOne();

    res.status(200).json({ message: 'Yorum başarıyla silindi' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getCommentsByContent, deleteComment };
