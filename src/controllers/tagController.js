const Tag = require('../models/Tag');
const slugify = require('slugify');

// Tüm Tag'leri Getir
exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

// Tek Bir Tag'i Getir
exports.getTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Etiket bulunamadı' });
    }
    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
};

// Yeni Tag Oluştur
exports.createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const newTag = await Tag.create({ name, slug });
    res.status(201).json(newTag);
  } catch (error) {
    next(error);
  }
};

// Tag Güncelle
exports.updateTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ message: 'Etiket bulunamadı' });
    }

    res.status(200).json(updatedTag);
  } catch (error) {
    next(error);
  }
};

// Tag Sil
exports.deleteTag = async (req, res, next) => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Etiket bulunamadı' });
    }
    res.status(200).json({ message: 'Etiket silindi' });
  } catch (error) {
    next(error);
  }
};
