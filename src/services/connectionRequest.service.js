import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

export const sendRequest = async (toUserId, fromUserId) => {
  const isToUserIdValid = await User.findOne({ _id: toUserId });
  if (!isToUserIdValid) {
    throw new Error("the user does not exist");
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
    throw new Error("request already exists");
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
    throw new Error("request not found");
  }
  // now some authorization check
  // toUser == loggedIn user => accept
  // toUser == loggedIn user => cancel
  // fromUser == loggedIn user => cancel

  const isSender = existingRequest.fromUserId.equals(user._id);
  const isReceiver = existingRequest.toUserId.equals(user._id);
  if (!isSender && !isReceiver) {
    return { success: false, message: "Not authorized" };
  }
  if (status === "accepted" && !isReceiver) {
    return { success: false, message: "not authorized" };
  }
  existingRequest.status = status;
  const data = await existingRequest.save();
  return {
    success: true,
    message: "request status changed to " + status,
    data: data,
  };
};
