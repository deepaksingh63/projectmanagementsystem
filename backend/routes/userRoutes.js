import express from "express";
import { deleteUser, getUsers, updateUserRole } from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getUsers);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;
