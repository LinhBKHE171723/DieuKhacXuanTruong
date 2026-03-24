import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { login, me } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validations/auth.validation.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", validate(loginSchema), asyncHandler(login));
router.get("/me", authenticate, asyncHandler(me));

export default router;
