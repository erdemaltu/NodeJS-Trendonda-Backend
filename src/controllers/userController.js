const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateTokens, verifyToken } = require('../utils/token');

// Kullanıcı oluşturma (register)
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
  
    try {
      // Kullanıcı zaten mevcut mu?
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email zaten kullanılıyor.' });
      }
  
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save();
  
      // Token'ları oluştur
      const { accessToken, refreshToken } = generateTokens(savedUser);
  
      // Refresh Token'ı sakla
      savedUser.refreshToken = refreshToken;
      await savedUser.save();
  
      res.status(201).json({
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };  

// Login
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz şifre.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Refresh Token'ı veritabanında sakla
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Token Yenileme
const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token gerekli.' });
  }

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Geçersiz Refresh Token.' });
    }

    const verified = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!verified) {
      return res.status(403).json({ message: 'Refresh Token doğrulanamadı.' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    user.refreshToken = newRefreshToken; // Refresh Token'ı yenile
    await user.save();

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

// Logout
const logoutUser = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null; // Refresh Token'ı sıfırla
      await user.save();
    }
    res.status(200).json({ message: 'Çıkış yapıldı.' });
  } catch (error) {
    next(error);
  }
};
  

// Kullanıcı profili görüntüleme
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Kullanıcı güncelleme
const updateUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    next(error);
  }
};

// Kullanıcı silme (sadece admin yetkili)
const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'Kullanıcı silindi.' });
  } catch (error) {
    next(error);
  }
};

// Tüm kullanıcıları listeleme (sadece admin yetkili)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserProfile,
  updateUser,
  deleteUser,
  getAllUsers,
};
