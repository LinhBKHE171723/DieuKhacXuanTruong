import { getCurrentUser, loginAdmin } from "../services/auth.service.js";

export const login = async (req, res) => {
  const data = await loginAdmin(req.validated.body);
  res.json({
    success: true,
    message: "Login successful",
    data
  });
};

export const me = async (req, res) => {
  const data = await getCurrentUser(req.user.id);
  res.json({
    success: true,
    data
  });
};
