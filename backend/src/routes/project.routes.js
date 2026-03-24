import { Router } from "express";
import {
  destroyProject,
  editProject,
  getProject,
  listProjects,
  storeProject
} from "../controllers/project.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { projectCreateSchema, projectUpdateSchema } from "../validations/project.validation.js";

const router = Router();

router.get("/", asyncHandler(listProjects));
router.get("/:id", asyncHandler(getProject));
router.post("/", validate(projectCreateSchema), asyncHandler(storeProject));
router.put("/:id", validate(projectUpdateSchema), asyncHandler(editProject));
router.delete("/:id", asyncHandler(destroyProject));

export default router;
