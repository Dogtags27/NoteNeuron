const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const protectedRoutes = require('./routes/protected');
const canvasRoutes = require('./routes/canvasRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/canvas', canvasRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
