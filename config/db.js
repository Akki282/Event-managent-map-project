import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB Connected 🚀");
  } catch (error) {
    console.error(error);
    console.error("DB Connection Failed ❌");
    process.exit(1);
  }
};

export default connectDB;