import * as service from "../services/profile.service.js";
const allowedFields = [
  "name",
  "age",
  "about",
  "skills",
  "gender",
  "removeProfileImage",
  "removeBannerImage",
];

export const view = async (req, res) => {
  res.json({ data: req.user });
};

export const editProfile = async (req, res) => {
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  const result = await service.editProfile({
    userId: req.user._id,
    updates,
    files: req.files,
  });

  return res.json(result);
};
