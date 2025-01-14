const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');
const limiter = require('./src/middlewares/rateLimiter');
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const tagRoutes = require('./src/routes/tagRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const adPlacementRoutes = require('./src/routes/adPlacementRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);

app.get('/', (req, res) => {    
    res.send('API Çalışıyor!');
});
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ads', adPlacementRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor.`));
