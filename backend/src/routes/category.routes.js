import { Router } from "express";
import {
  destroyCategory,
  editCategory,
  getCategory,
  listCategories,
  storeCategory
} from "../controllers/category.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { categoryCreateSchema, categoryUpdateSchema } from "../validations/category.validation.js";

const router = Router();

router.get("/", asyncHandler(listCategories));
router.get("/:id", asyncHandler(getCategory));
router.post("/", validate(categoryCreateSchema), asyncHandler(storeCategory));
router.put("/:id", validate(categoryUpdateSchema), asyncHandler(editCategory));
router.delete("/:id", asyncHandler(destroyCategory));

export default router;
