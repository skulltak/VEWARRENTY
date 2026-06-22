// Vercel Serverless Function entry point
// This file is the bridge between Vercel's serverless runtime and the Express app.

require('dotenv').config();
const app = require('../backend/server');

module.exports = app;
