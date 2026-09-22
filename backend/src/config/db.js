import mongoose from 'mongoose';

export const connectDB = async () => {
  // If no MongoDB URI is set in cloud/serverless environment, immediately use the in-memory fallback store
  if (!process.env.MONGODB_URI && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
    console.log('[MongoDB]: Running in fallback mock mode (no MONGODB_URI provided in production).');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hand_embroidered_dresses', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(`Tip: Ensure MongoDB service is running (e.g., mongod or MongoDB Atlas connection string in .env)`);
    // Do not crash server in dev so health checks & documentation routes continue to respond
    return null;
  }
};
