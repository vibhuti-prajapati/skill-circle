import * as service from "../services/user.service.js";

export const receivedRequest = async (req, res) => {
  const userId = req.user._id;
  const result = await service.getReceivedRequest(userId);
  res.json(result);
};
export const sentRequest = async (req, res) => {
  const userId = req.user._id;
  const result = await service.getSentRequests(userId);
  res.json(result);
};
export const connections = async (req, res) => {
  const userId = req.user._id;
  const result = await service.getConnections(userId);
  res.json(result);
};

export const loadFeed = async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) > 20 ? 10 : req.query.limit || 10;
  const skip = (page - 1) * limit;

  const result = await service.generateFeed(userId, page, limit, skip);
  res.json(result);
};
