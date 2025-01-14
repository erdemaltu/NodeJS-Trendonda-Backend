const AdPlacement = require('../models/AdPlacement');

// Reklam Ekle
const addAdPlacement = async (req, res, next) => {
  try {
    const { location, code, status } = req.body;

    const newAdPlacement = new AdPlacement({ location, code, status });

    await newAdPlacement.save();

    res.status(201).json({ message: 'Reklam başarıyla eklendi', adPlacement: newAdPlacement });
  } catch (error) {
    next(error);
  }
};

// Reklam Listele
const getAdPlacements = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};
    const adPlacements = await AdPlacement.find(filter);

    res.status(200).json({ adPlacements });
  } catch (error) {
    next(error);
  }
};

// Reklam Güncelle
const updateAdPlacement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { location, code, status } = req.body;

    const updatedAdPlacement = await AdPlacement.findByIdAndUpdate(
      id,
      { location, code, status },
      { new: true, runValidators: true }
    );

    if (!updatedAdPlacement) {
      return res.status(404).json({ message: 'Reklam bulunamadı' });
    }

    res.status(200).json({ message: 'Reklam başarıyla güncellendi', adPlacement: updatedAdPlacement });
  } catch (error) {
    next(error);
  }
};

// Reklam Sil
const deleteAdPlacement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const adPlacement = await AdPlacement.findById(id);
    if (!adPlacement) {
      return res.status(404).json({ message: 'Reklam bulunamadı' });
    }

    await adPlacement.deleteOne();

    res.status(200).json({ message: 'Reklam başarıyla silindi' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addAdPlacement, getAdPlacements, updateAdPlacement, deleteAdPlacement };
