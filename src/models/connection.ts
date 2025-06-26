// models/Connection.ts
import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema(
  {
    requesterId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    recipientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected"], 
      default: "pending",
      required: true 
    },
    message: { 
      type: String, 
      default: "" 
    },
    acceptedAt: { 
      type: Date 
    },
    rejectedAt: { 
      type: Date 
    },
    rejectionReason: { 
      type: String 
    }
  },
  { 
    timestamps: true 
  }
);

// Compound index to prevent duplicate connection requests
ConnectionSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

// Index for faster queries
ConnectionSchema.index({ requesterId: 1, status: 1 });
ConnectionSchema.index({ recipientId: 1, status: 1 });
ConnectionSchema.index({ status: 1, createdAt: -1 });

// Instance methods
ConnectionSchema.methods.accept = function() {
  this.status = 'accepted';
  this.acceptedAt = new Date();
  return this.save();
};

ConnectionSchema.methods.reject = function(reason?: string) {
  this.status = 'rejected';
  this.rejectedAt = new Date();
  if (reason) {
    this.rejectionReason = reason;
  }
  return this.save();
};

// Define interface for static methods
interface IConnectionModel extends mongoose.Model<any> {
  findConnectionBetween(userId1: string, userId2: string): Promise<any>;
}

// Static methods
ConnectionSchema.statics.findConnectionBetween = function(userId1: string, userId2: string) {
  return this.findOne({
    $or: [
      { requesterId: userId1, recipientId: userId2 },
      { requesterId: userId2, recipientId: userId1 }
    ]
  });
};

const Connection = (mongoose.models.Connection || mongoose.model("Connection", ConnectionSchema)) as IConnectionModel;

export default Connection;