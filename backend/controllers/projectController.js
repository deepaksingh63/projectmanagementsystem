import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import AppError from "../utils/AppError.js";

const canAccessProject = (project, userId, role) =>
  role === "admin" || project.owner.equals(userId) || project.members.some((member) => member.equals(userId));

export const getProjects = async (req, res) => {
  const { search = "", priority, status } = req.query;
  const filters = {
    title: { $regex: search, $options: "i" },
  };

  if (priority) {
    filters.priority = priority;
  }

  if (status) {
    filters.status = status;
  }

  if (req.user.role !== "admin") {
    filters.$or = [{ owner: req.user._id }, { members: req.user._id }];
  }

  const projects = await Project.find(filters)
    .populate("owner", "name email role")
    .populate("members", "name email role avatar")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: projects.length,
    data: projects,
  });
};

export const createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    owner: req.user._id,
  });

  const populatedProject = await Project.findById(project._id)
    .populate("owner", "name email role")
    .populate("members", "name email role avatar");

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: populatedProject,
  });
};

export const updateProject = async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!canAccessProject(project, req.user._id, req.user.role)) {
    return next(new AppError("You cannot edit this project", 403));
  }

  const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("owner", "name email role")
    .populate("members", "name email role avatar");

  res.json({
    success: true,
    message: "Project updated successfully",
    data: updatedProject,
  });
};

export const deleteProject = async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (req.user.role !== "admin" && !project.owner.equals(req.user._id)) {
    return next(new AppError("Only admins or project owners can delete projects", 403));
  }

  await Task.deleteMany({ projectId: project._id });
  await project.deleteOne();

  res.json({
    success: true,
    message: "Project deleted successfully",
  });
};

export const getProjectAnalytics = async (_req, res) => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const projectProgress = await Task.aggregate([
    {
      $group: {
        _id: "$projectId",
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "_id",
        as: "project",
      },
    },
    {
      $unwind: "$project",
    },
    {
      $project: {
        title: "$project.title",
        progress: {
          $cond: [
            { $eq: ["$totalTasks", 0] },
            0,
            {
              $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100],
            },
          ],
        },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      taskStatus: stats,
      projectProgress,
    },
  });
};
