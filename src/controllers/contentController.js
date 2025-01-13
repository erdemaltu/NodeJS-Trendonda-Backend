const Content = require('../models/Content');

// İçerik oluşturma
const createContent = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const content = await Content.create({
      title,
      description,
      category,
      user: req.user.id,
    });

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// İçerikleri listeleme
const getContents = async (req, res) => {
  try {
    const contents = await Content.find().populate('user', 'name email');
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// İçeriği detaylı görüntüleme
const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('user', 'name email');
    if (!content) return res.status(404).json({ message: 'İçerik bulunamadı' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// İçeriği düzenleme
const updateContent = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const content = await Content.findById(req.params.id);

    if (!content) return res.status(404).json({ message: 'İçerik bulunamadı' });

    if (content.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Yetkiniz yok' });
    }

    content.title = title || content.title;
    content.description = description || content.description;
    content.category = category || content.category;

    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// İçeriği silme
const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) return res.status(404).json({ message: 'İçerik bulunamadı' });

    if (content.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Yetkiniz yok' });
    }

    await content.deleteOne();
    res.json({ message: 'İçerik silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContent, getContents, getContentById, updateContent, deleteContent };
