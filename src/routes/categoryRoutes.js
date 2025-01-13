const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET: Tüm kategorileri listele
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Kategoriler alınamadı." });
  }
});

// POST: Yeni kategori oluştur
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Kategori oluşturulamadı." });
  }
});

// PUT: Mevcut kategoriyi güncelle
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Kategori güncellenemedi." });
  }
});

// DELETE: Kategori sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Kategori silindi." });
  } catch (error) {
    res.status(500).json({ error: "Kategori silinemedi." });
  }
});

module.exports = router;
