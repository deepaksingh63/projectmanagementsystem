import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import AppError from "../utils/AppError.js";

export const getUsers = async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
};

export const updateUserRole = async (req, res, next) => {
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return next(new AppError("Invalid role", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.json({
    success: true,
    message: "User role updated",
    data: user,
  });
};

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await Project.updateMany({ members: user._id }, { $pull: { members: user._id } });
  await Task.deleteMany({ assignedTo: user._id });
  await user.deleteOne();

  res.json({
    success: true,
    message: "User deleted",
  });
};
