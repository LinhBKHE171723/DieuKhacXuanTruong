import { deleteMediaById, getMediaList, uploadMediaFiles } from "../services/media.service.js";

export const listMedia = async (req, res) => {
  const data = await getMediaList(req.query);
  res.json({ success: true, data });
};

export const uploadMedia = async (req, res) => {
  const data = await uploadMediaFiles({
    files: req.files,
    folder: req.body.folder
  });
  res.status(201).json({ success: true, message: "Media uploaded", data });
};

export const destroyMedia = async (req, res) => {
  await deleteMediaById(req.params.id);
  res.json({ success: true, message: "Media deleted" });
};
