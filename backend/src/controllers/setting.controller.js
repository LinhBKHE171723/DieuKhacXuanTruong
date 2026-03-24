import { getSettingsObject, upsertSettings } from "../services/setting.service.js";

export const getSettings = async (req, res) => {
  const data = await getSettingsObject();
  res.json({ success: true, data });
};

export const editSettings = async (req, res) => {
  const data = await upsertSettings(req.validated.body);
  res.json({ success: true, message: "Settings updated", data });
};
