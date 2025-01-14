const express = require('express');
const { protect } = require('../middlewares/authAdminMiddleware');
const { createAdmin, deleteAdmin, login } = require('../controllers/adminController');
const logAdminAction = require('../middlewares/logAdminAction');
const router = express.Router();

router.post('/create', protect, logAdminAction('create', 'admin'), createAdmin);
router.delete('/:id', protect, logAdminAction('delete', 'admin'), deleteAdmin);
router.post('/login', login);

module.exports = router;
