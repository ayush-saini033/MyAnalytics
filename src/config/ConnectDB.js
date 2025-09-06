import mongoose from "mongoose";

let isConnected = false; // 🔄 Track connection status

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "myapp", 
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // stop the app if DB fails
  }
};
