import * as service from "../services/connectionRequest.service.js";
export const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId } = req.body;

    const result = await service.sendRequest(toUserId, fromUserId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const reviewRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const result = await service.reviewRequest({
      user: req.user,
      requestId: requestId,
      status: status,
    });
    res.json(result);
  } catch (err) {
    res.status(400).json(err.message);
  }
};
