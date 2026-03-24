import { Router } from "express";
import {
  destroyProduct,
  editProduct,
  getProduct,
  listProducts,
  storeProduct
} from "../controllers/product.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { productCreateSchema, productUpdateSchema } from "../validations/product.validation.js";

const router = Router();

router.get("/", asyncHandler(listProducts));
router.get("/:id", asyncHandler(getProduct));
router.post("/", validate(productCreateSchema), asyncHandler(storeProduct));
router.put("/:id", validate(productUpdateSchema), asyncHandler(editProduct));
router.delete("/:id", asyncHandler(destroyProduct));

export default router;
