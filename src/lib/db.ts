import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!; // Ensure you add this in `.env`

if (!MONGODB_URI) {
  throw new Error("⚠️ MongoDB URI is missing in environment variables.");
}

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "networtyideas" });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

export default dbConnect;
