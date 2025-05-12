// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: [
        "founder", 
        "cofounder",
        "developer",
        "designer",
        "marketer",
        "investor",
        "advisor",
        "product",
        "operations",
        "sales",
        "finance",
        "customer_success",
        "data_scientist",
        "growth_hacker",
        "legal"
      ], 
      required: true 
    },
    profileImage: { type: String },
    description: { type: String },
    demoVideos: [{ type: String }], // For influencers
    skills: [{
      skill: { type: String },
      level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"] }
    }],
    lookingFor: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
