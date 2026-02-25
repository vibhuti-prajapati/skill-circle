import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
const ALLOWED_FEILDS = [
  "name",
  "age",
  "gender",
  "about",
  "skills",
  "profileImage",
  "bannerImage",
];
export const getReceivedRequest = async (userId) => {
  const pendingRequests = await ConnectionRequest.find({
    toUserId: userId,
    status: "pending",
  }).populate("fromUserId", ALLOWED_FEILDS);

  return {
    success: true,
    data: pendingRequests,
    count: pendingRequests.length,
  };
};

export const getSentRequests = async (userId) => {
  const sentRequests = await ConnectionRequest.find({
    fromUserId: userId,
    status: "pending",
  }).populate("toUserId", ALLOWED_FEILDS);
  return { success: true, data: sentRequests, count: sentRequests.length };
};

export const getConnections = async (userId) => {
  const acceptedRequests = await ConnectionRequest.find({
    $or: [{ toUserId: userId }, { fromUserId: userId }],
    status: "accepted",
  })
    .populate("fromUserId", ALLOWED_FEILDS)
    .populate("toUserId", ALLOWED_FEILDS);

  const connenctions = acceptedRequests.map((row) => {
    if (row.fromUserId._id.equals(userId)) {
      return row.toUserId;
    }
    return row.fromUserId;
  });
  return { success: true, data: connenctions, count: connenctions.length };
};

// TODO : enhance the feed api -> add filters and more stuff
export const generateFeed = async (userId, page, limit, skip) => {
  // get ._id of people who have sent or received requests from :status ="pending"|| "accepted"
  const sentRequestProfiles = await ConnectionRequest.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }],
    status: { $in: ["pending", "accepted"] },
  }).select("fromUserId toUserId");

  const hiddenProfiles = new Set();
  sentRequestProfiles.forEach((element) => {
    hiddenProfiles.add(element.fromUserId.toString());
    hiddenProfiles.add(element.toUserId.toString());
  });
  const users = await User
    .find({
      _id: {
        $nin: Array.from(hiddenProfiles),
        $ne: userId,
      },
    })

    .select(ALLOWED_FEILDS)
    .skip(skip)
    .limit(limit);
  return { success: true, data: users, count: users.length };
};
