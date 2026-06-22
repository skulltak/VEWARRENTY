const mongoose = require('mongoose');

// Cache the connection across serverless function invocations
// This prevents exhausting connection limits on MongoDB Atlas
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection immediately if available
  if (cached.conn) {
    return cached.conn;
  }

  // Wait for an in-flight connection attempt if one is already running
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      })
      .catch((error) => {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        cached.promise = null; // Allow retry on next invocation
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
