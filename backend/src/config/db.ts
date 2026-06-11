import mongoose from 'mongoose';
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/researchpilot';
  await mongoose.connect(uri);
};
