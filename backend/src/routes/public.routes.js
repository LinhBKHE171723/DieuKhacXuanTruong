import { Router } from "express";
import {
  createPublicContact,
  getAbout,
  getCategories,
  getHome,
  getProductDetail,
  getProducts,
  getProjectDetail,
  getProjects,
  getSettings
} from "../controllers/public.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { contactCreateSchema } from "../validations/contact.validation.js";

const router = Router();

router.get("/home", asyncHandler(getHome));
router.get("/about", asyncHandler(getAbout));
router.get("/settings", asyncHandler(getSettings));
router.get("/categories", asyncHandler(getCategories));
router.get("/products", asyncHandler(getProducts));
router.get("/products/:slug", asyncHandler(getProductDetail));
router.get("/projects", asyncHandler(getProjects));
router.get("/projects/:slug", asyncHandler(getProjectDetail));
router.post("/contacts", validate(contactCreateSchema), asyncHandler(createPublicContact));

export default router;
