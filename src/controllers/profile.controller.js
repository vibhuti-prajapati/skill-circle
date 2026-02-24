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
  try {
    res.json({ data: req.user });
  } catch (err) {
    res.send("something went wrong" + err);
  }
};

export const editProfile = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({success: false, message : err.message});
  }
};
