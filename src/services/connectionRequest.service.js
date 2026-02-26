import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

export const sendRequest = async (toUserId, fromUserId) => {
  const isToUserIdValid = await User.findOne({ _id: toUserId });
  if (!isToUserIdValid) {
    throw new AppError("the user does not exist", 404);
  }
  // TODO : improve this for race conditions

  // allowed duplicate requests if the status is not pending or accepted
  // ---> so after request is cancelled it can be made again

  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
    status: { $in: ["pending", "accepted"] },
  });

  if (existingRequest) {
    throw new AppError("request already exists", 409);
  }

  const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
  });

  await connectionRequest.save();

  return {
    message: "connection request sent successfully",
    data: connectionRequest,
  };
};

export const reviewRequest = async ({ user, requestId, status }) => {
  const existingRequest = await ConnectionRequest.findOne({
    _id: requestId,
    status: "pending",
  });
  if (!existingRequest || existingRequest.status !== "pending") {
    throw new AppError("request not found", 409);
  }
  // now some authorization check
  // toUser == loggedIn user => accept
  // toUser == loggedIn user => cancel
  // fromUser == loggedIn user => cancel

  const isSender = existingRequest.fromUserId.equals(user._id);
  const isReceiver = existingRequest.toUserId.equals(user._id);
  if (!isSender && !isReceiver) {
    throw new AppError("Not authorized", 403);
  }
  if (status === "accepted" && !isReceiver) {
    throw new AppError("Not authorized", 403);
  }
  existingRequest.status = status;
  const data = await existingRequest.save();
  return {
    success: true,
    message: "request status changed to " + status,
    data: data,
  };
};
