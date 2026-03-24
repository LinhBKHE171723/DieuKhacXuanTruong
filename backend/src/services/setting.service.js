import { Setting } from "../models/index.js";

export const getSettingsObject = async () => {
  const settings = await Setting.find({}).sort({ key: 1 });
  return settings.reduce((accumulator, item) => {
    accumulator[item.key] = item.value;
    return accumulator;
  }, {});
};

export const upsertSettings = async (payload) => {
  const entries = Object.entries(payload);
  await Promise.all(
    entries.map(async ([key, value]) => {
      await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true, setDefaultsOnInsert: true });
    })
  );

  return getSettingsObject();
};
