import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["founder", "cofounder"], required: true },
    profileImage: { type: String },
    instagramUrl: { type: String },
    description: { type: String },
    demoVideos: [{ type: String }], // For influencers
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
