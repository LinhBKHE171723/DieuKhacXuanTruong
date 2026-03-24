import { Router } from "express";
import { editPage, getPage, listPages } from "../controllers/page.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { pageUpdateSchema } from "../validations/page.validation.js";

const router = Router();

router.get("/", asyncHandler(listPages));
router.get("/:slug", asyncHandler(getPage));
router.put("/:slug", validate(pageUpdateSchema), asyncHandler(editPage));

export default router;
