import { Router } from "express";
import authRoutes from "./auth.routes.js";
import bannerRoutes from "./banner.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import projectRoutes from "./project.routes.js";
import contactRoutes from "./contact.routes.js";
import pageRoutes from "./page.routes.js";
import settingRoutes from "./setting.routes.js";
import mediaRoutes from "./media.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import publicRoutes from "./public.routes.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/public", publicRoutes);

router.use("/admin", authenticate);
router.use("/admin/dashboard", dashboardRoutes);
router.use("/admin/banners", bannerRoutes);
router.use("/admin/categories", categoryRoutes);
router.use("/admin/products", productRoutes);
router.use("/admin/projects", projectRoutes);
router.use("/admin/contacts", contactRoutes);
router.use("/admin/pages", pageRoutes);
router.use("/admin/settings", settingRoutes);
router.use("/admin/media", mediaRoutes);

export default router;
