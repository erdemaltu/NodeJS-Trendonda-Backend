const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  // Authorization Header Kontrolü
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      // Token Doğrulama
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Admin Bilgisini Veritabanından Çekme
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(404).json({ message: 'Admin bulunamadı!' });
      }

      req.admin = admin; // Admin'i req.admin'e atama
      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({ message: 'Token doğrulama başarısız!' });
    }
  } else {
    return res.status(401).json({ message: 'Token eksik veya geçersiz!' });
  }
};

module.exports = { protect };
