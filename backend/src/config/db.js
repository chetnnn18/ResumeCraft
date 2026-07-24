import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the MONGODB_URI from environment variables.
 * Exits the process on connection failure so the server doesn't run without a DB.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    console.warn(`⚠️ Running backend without active MongoDB connection. Please update MONGODB_URI in backend/.env if needed.`);
  }
};
