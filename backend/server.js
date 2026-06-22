require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const salesRoutes = require('./routes/sales');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite frontend
app.use(express.json());

// Routes
app.use('/api/sales', salesRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'vewarrenty backend running ✅' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
