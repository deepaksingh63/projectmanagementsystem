import Task from "../models/Task.js";
import Project from "../models/Project.js";
import AppError from "../utils/AppError.js";

export const getTasks = async (req, res) => {
  const { status, priority, search = "" } = req.query;
  const filters = {
    title: { $regex: search, $options: "i" },
  };

  if (status) {
    filters.status = status;
  }

  if (priority) {
    filters.priority = priority;
  }

  if (req.user.role !== "admin") {
    filters.assignedTo = req.user._id;
  }

  const tasks = await Task.find(filters)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email")
    .populate("projectId", "title status priority")
    .populate("comments.author", "name")
    .sort({ dueDate: 1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
};

export const createTask = async (req, res, next) => {
  const project = await Project.findById(req.body.projectId);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email")
    .populate("projectId", "title status priority");

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: populatedTask,
  });
};

export const updateTask = async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  const canEdit = req.user.role === "admin" || task.assignedTo.equals(req.user._id) || task.createdBy.equals(req.user._id);

  if (!canEdit) {
    return next(new AppError("You cannot edit this task", 403));
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email")
    .populate("projectId", "title status priority")
    .populate("comments.author", "name");

  res.json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
};

export const deleteTask = async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (req.user.role !== "admin" && !task.createdBy.equals(req.user._id)) {
    return next(new AppError("Only admins or task creators can delete tasks", 403));
  }

  await task.deleteOne();

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
};

export const addComment = async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  task.comments.push({
    message: req.body.message,
    author: req.user._id,
  });

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email")
    .populate("projectId", "title status priority")
    .populate("comments.author", "name");

  res.json({
    success: true,
    message: "Comment added successfully",
    data: updatedTask,
  });
};
