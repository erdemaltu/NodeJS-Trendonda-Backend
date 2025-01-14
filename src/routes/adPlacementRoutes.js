const express = require('express');
const {
  addAdPlacement,
  getAdPlacements,
  updateAdPlacement,
  deleteAdPlacement,
} = require('../controllers/adPlacementController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, isAdmin, addAdPlacement);
router.get('/', protect, isAdmin, getAdPlacements);
router.put('/:id', protect, isAdmin, updateAdPlacement);
router.delete('/:id', protect, isAdmin, deleteAdPlacement);

module.exports = router;
