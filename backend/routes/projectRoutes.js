import express from "express";
import {
  createProject,
  deleteProject,
  getProjectAnalytics,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { projectSchema } from "../validators/projectValidators.js";

const router = express.Router();

router.use(protect);

router.get("/", getProjects);
router.get("/analytics", authorize("admin"), getProjectAnalytics);
router.post("/", authorize("admin"), validateRequest(projectSchema), createProject);
router.put("/:id", validateRequest(projectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
