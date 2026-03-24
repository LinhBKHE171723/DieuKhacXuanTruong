import { Router } from "express";
import { destroyMedia, listMedia, uploadMedia } from "../controllers/media.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", asyncHandler(listMedia));
router.post("/upload", upload.array("files", 20), asyncHandler(uploadMedia));
router.delete("/:id", asyncHandler(destroyMedia));

export default router;
