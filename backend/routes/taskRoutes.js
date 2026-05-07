import express from "express";
import {
  addComment,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { commentSchema, taskSchema } from "../validators/taskValidators.js";

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", authorize("admin"), validateRequest(taskSchema), createTask);
router.put("/:id", validateRequest(taskSchema), updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/comments", validateRequest(commentSchema), addComment);

export default router;
