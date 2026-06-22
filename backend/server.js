require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const salesRoutes = require('./routes/sales');

const app = express();

// Connect to MongoDB (uses cached connection in serverless environments)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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
