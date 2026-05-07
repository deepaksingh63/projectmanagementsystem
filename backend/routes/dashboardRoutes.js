import express from "express";
import { getAdminDashboard, getUserDashboard } from "../controllers/dashboardController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/admin", authorize("admin"), getAdminDashboard);
router.get("/user", authorize("admin", "user"), getUserDashboard);

export default router;
