const jwt = require('jsonwebtoken');

// Token üretim fonksiyonu
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token ömrü
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d', // Refresh token ömrü
  });

  return { accessToken, refreshToken };
};

// Token doğrulama fonksiyonu
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = { generateTokens, verifyToken };
