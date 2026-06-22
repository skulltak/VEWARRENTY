require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const salesRoutes = require('./routes/sales');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Await DB connection before every request (safe for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(500).json({ message: 'Database connection failed.', error: err.message });
  }
});

// Routes
app.use('/api/sales', salesRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'vewarrenty backend running ✅' });
});

// Only start listening when run locally (not on Vercel)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
