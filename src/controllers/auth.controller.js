import * as authService from "../services/auth.service.js";
export const signup = async (req, res) => {
  try {
    const result = await authService.signUp(req.body);
    res.status(201).json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user, message } = await authService.login(req.body);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      httpOnly: true,
    });
    res.status(201).json({ success: true, message: message, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
