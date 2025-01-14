const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kullanıcı kimlik doğrulama (Access Token kontrolü)
const protect = async (req, res, next) => {
  let token;

  // Authorization header'ında Bearer token kontrolü
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // Token doğrulama
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı, yetkilendirme başarısız.' });
      }

      next(); // Kimlik doğrulaması başarılı
    } catch (error) {
      console.error('JWT doğrulama hatası:', error.message);
      res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş.' });
    }
  } else {
    res.status(401).json({ message: 'Token eksik, yetkilendirme başarısız.' });
  }
};

// Admin yetki kontrolü
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Erişim reddedildi, admin yetkisi gerekli.' });
  }
};

module.exports = { protect, isAdmin };
