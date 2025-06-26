// models/Profile.ts
import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  level: { 
    type: String, 
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"], 
    required: true 
  }
});

const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String },
  technologies: [{ type: String }]
});

const ProfileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true 
    },
    bio: { type: String },
    website: { type: String },
    profileImage: { type: String }, // ImageKit URL
    profileImageId: { type: String }, // ImageKit file ID for deletion
    skills: [SkillSchema],
    socialLinks: [SocialLinkSchema],
    projects: [ProjectSchema],
    
    // Additional profile fields
    location: { type: String },
    timezone: { type: String },
    languages: [{ type: String }],
    availability: { 
      type: String, 
      enum: ["full-time", "part-time", "weekends", "flexible"], 
      default: "flexible" 
    },
    
    // Privacy settings
    isPublic: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    
    // Profile completion tracking
    profileCompleteness: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Calculate profile completeness on save
ProfileSchema.pre('save', function(next) {
  let completeness = 0;
  const maxScore = 100;
  
  // Basic info (40 points)
  if (this.bio) completeness += 15;
  if (this.profileImage) completeness += 15;
  if (this.website) completeness += 10;
  
  // Skills (20 points)
  if (this.skills && this.skills.length > 0) {
    completeness += Math.min(20, this.skills.length * 4);
  }
  
  // Social links (20 points)
  if (this.socialLinks && this.socialLinks.length > 0) {
    completeness += Math.min(20, this.socialLinks.length * 5);
  }
  
  // Projects (20 points)
  if (this.projects && this.projects.length > 0) {
    completeness += Math.min(20, this.projects.length * 10);
  }
  
  this.profileCompleteness = Math.min(maxScore, completeness);
  next();
});

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);