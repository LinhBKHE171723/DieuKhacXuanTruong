import { Router } from "express";
import { editSettings, getSettings } from "../controllers/setting.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { settingsUpdateSchema } from "../validations/setting.validation.js";

const router = Router();

router.get("/", asyncHandler(getSettings));
router.put("/", validate(settingsUpdateSchema), asyncHandler(editSettings));

export default router;
