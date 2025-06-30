// models/User.ts
import mongoose, { Document, Model } from "mongoose";

// Define interfaces for TypeScript
interface ISkill {
  skill: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface ISocialLink {
  platform: string;
  url: string;
}

interface IProject {
  title: string;
  description: string;
  url?: string;
  technologies: string[];
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name?: string;
  role: string;
  bio?: string;
  description?: string;
  website?: string;
  location?: string;
  profileImage?: string;
  skills?: ISkill[];
  lookingFor?: string[];
  socialLinks?: ISocialLink[];
  instagramUrl?: string;
  projects?: IProject[];
  demoVideos?: string[];
  isAvailable?: boolean;
  lastActive?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Email verification fields
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

const SkillSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  level: { 
    type: String, 
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    required: true 
  }
}, { _id: false });

const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String },
  technologies: [{ type: String }]
}, { _id: false });

const UserSchema = new mongoose.Schema<IUser>(
  {
    // Basic Auth Info
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    
    // Profile Info
    name: { type: String },
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
    
    // Profile Details
    bio: { type: String },
    description: { type: String },
    website: { type: String },
    location: { type: String },
    profileImage: { type: String },
    
    // Skills and Experience
    skills: [SkillSchema],
    lookingFor: [{ type: String }],
    
    // Social Links
    socialLinks: [SocialLinkSchema],
    instagramUrl: { type: String },
    
    // Projects
    projects: [ProjectSchema],
    
    // Legacy fields
    demoVideos: [{ type: String }],
    
    // Availability Status
    isAvailable: { type: Boolean, default: true },
    lastActive: { type: Date, default: Date.now },
    
    // Email Verification
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date }
  },
  { timestamps: true }
);

// Update lastActive on save
UserSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ 'skills.skill': 1 });
UserSchema.index({ isAvailable: 1 });
UserSchema.index({ lastActive: -1 });
UserSchema.index({ emailVerificationToken: 1 });

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default UserModel;
export type { IUser };