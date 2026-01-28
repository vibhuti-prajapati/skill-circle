import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "pending", "cancelled"],
        message: `{VALUE} inavlid status`,
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
export default new mongoose.model("ConnectionRequest", connectionRequestSchema);
