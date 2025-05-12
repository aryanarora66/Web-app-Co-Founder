import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    targetAudience: { type: String },
    selectedInfluencers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
