import * as authService from "../services/auth.service.js";
export const signup = async (req, res) => {
    const result = await authService.signUp(req.body);
    res.status(201).json({ success: true, message: result.message });
};

export const login = async (req, res) => {
    const { token, user, message } = await authService.login(req.body);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      httpOnly: true,
    });
    res.status(201).json({ success: true, message: message, data: user });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};
