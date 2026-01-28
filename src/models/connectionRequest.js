import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "interested", "rejected", "ignored"],
        message: `{VALUE} inavlid status`,
      },
    },
  },
  {
    timeseries: true,
  },
);

export default new mongoose.model("ConnectionRequest", connectionRequestSchema);
