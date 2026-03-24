import { Router } from "express";
import {
  destroyContact,
  editContactStatus,
  getContact,
  listContacts
} from "../controllers/contact.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { contactStatusSchema } from "../validations/contact.validation.js";

const router = Router();

router.get("/", asyncHandler(listContacts));
router.get("/:id", asyncHandler(getContact));
router.patch("/:id/status", validate(contactStatusSchema), asyncHandler(editContactStatus));
router.delete("/:id", asyncHandler(destroyContact));

export default router;
