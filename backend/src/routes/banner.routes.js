import { Router } from "express";
import {
  destroyBanner,
  editBanner,
  getBanner,
  listBanners,
  sortBanners,
  storeBanner
} from "../controllers/banner.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  bannerCreateSchema,
  bannerReorderSchema,
  bannerUpdateSchema
} from "../validations/banner.validation.js";

const router = Router();

router.get("/", asyncHandler(listBanners));
router.patch("/reorder", validate(bannerReorderSchema), asyncHandler(sortBanners));
router.get("/:id", asyncHandler(getBanner));
router.post("/", validate(bannerCreateSchema), asyncHandler(storeBanner));
router.put("/:id", validate(bannerUpdateSchema), asyncHandler(editBanner));
router.delete("/:id", asyncHandler(destroyBanner));

export default router;
