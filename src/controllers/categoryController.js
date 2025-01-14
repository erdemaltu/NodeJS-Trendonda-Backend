const Category = require('../models/Category');

// Kategori Oluşturma
const createCategory = async (req, res, next) => {
  const { name, slug, description } = req.body;

  try {
    const newCategory = new Category({ name, slug, description });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

// Kategorileri Listeleme
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Kategori Güncelleme
const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, slug, description } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true }
    );
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// Kategori Silme
const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Kategori silindi' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
