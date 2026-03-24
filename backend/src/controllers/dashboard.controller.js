import { getDashboardSummary } from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
  const data = await getDashboardSummary();
  res.json({ success: true, data });
};
