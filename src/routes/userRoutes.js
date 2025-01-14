const express = require('express');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserProfile,
  updateUser,
  deleteUser,
  getAllUsers,
} = require('../controllers/userController');

const router = express.Router();

// Kullanıcı oluşturma (register)
router.post('/register', registerUser);

// Kullanıcı giriş yapma (login)
router.post('/login', loginUser);

//Token yenileme
router.post('/token', refreshToken);

// Kullanıcı çıkış yapma (logout)
router.post('/logout', protect, logoutUser);

// Kullanıcı profili görüntüleme
router.get('/profile', protect, getUserProfile);

// Kullanıcı güncelleme
router.put('/profile', protect, updateUser);

// Kullanıcı silme (sadece admin yetkili)
router.delete('/:id', protect, isAdmin, deleteUser);

// Tüm kullanıcıları listeleme (admin yetkili)
router.get('/', protect, isAdmin, getAllUsers);

module.exports = router;
