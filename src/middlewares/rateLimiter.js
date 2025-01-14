const rateLimit = require('express-rate-limit');

// Rate limit middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 15 dakika içinde maksimum 100 istek
  message: {
    message: 'Çok fazla istek yapıldı, lütfen daha sonra tekrar deneyin.',
  },
  standardHeaders: true, // Rate limit bilgilerini 'RateLimit-*' header'larında göster
  legacyHeaders: false, // 'X-RateLimit-*' header'larını devre dışı bırak
});

module.exports = limiter;
