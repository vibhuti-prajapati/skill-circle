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
        // TODO : add  interested , ignored ? need a way to know interest of user
        // and why have rejected ? because its not like we are gonna notify about rejectiion
        values: ["accepted", "pending", "cancelled"],
        message: `{VALUE} inavlid status`,
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);
connectionRequestSchema.index(
  { fromUserId: 1, toUserId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  }
);
export default new mongoose.model("ConnectionRequest", connectionRequestSchema);
