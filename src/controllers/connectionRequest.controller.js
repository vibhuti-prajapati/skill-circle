import * as service from "../services/connectionRequest.service.js";
export const sendRequest = async (req, res) => {
    const fromUserId = req.user._id;
    const { toUserId } = req.body;

    const result = await service.sendRequest(toUserId, fromUserId);
    res.json(result);
};

export const reviewRequest = async (req, res) => {
    const { requestId, status } = req.body;
    const result = await service.reviewRequest({
      user: req.user,
      requestId: requestId,
      status: status,
    });
    res.json(result);
};
