import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getAdminDashboard = async (_req, res) => {
  const [totalUsers, totalProjects, completedTasks, pendingTasks, recentTasks, activeUsers, taskStatus, projectProgress] =
    await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Task.countDocuments({ status: "completed" }),
      Task.countDocuments({ status: { $ne: "completed" } }),
      Task.find()
        .populate("assignedTo", "name")
        .populate("projectId", "title")
        .sort({ createdAt: -1 })
        .limit(6),
      User.find().sort({ lastActiveAt: -1 }).limit(6).select("name email role lastActiveAt avatar"),
      Task.aggregate([{ $group: { _id: "$status", value: { $sum: 1 } } }]),
      Task.aggregate([
        {
          $group: {
            _id: "$projectId",
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
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
        { $unwind: "$project" },
        {
          $project: {
            title: "$project.title",
            progress: {
              $round: [
                {
                  $multiply: [{ $divide: ["$completed", "$total"] }, 100],
                },
                0,
              ],
            },
          },
        },
      ]),
    ]);

  res.json({
    success: true,
    data: {
      cards: { totalUsers, totalProjects, completedTasks, pendingTasks },
      taskStatus,
      projectProgress,
      recentTasks,
      activeUsers,
    },
  });
};

export const getUserDashboard = async (req, res) => {
  const [myTasks, completedTasks, upcomingDeadlines, notifications] = await Promise.all([
    Task.find({ assignedTo: req.user._id })
      .populate("projectId", "title")
      .sort({ dueDate: 1 }),
    Task.countDocuments({ assignedTo: req.user._id, status: "completed" }),
    Task.find({
      assignedTo: req.user._id,
      status: { $ne: "completed" },
      dueDate: { $gte: new Date() },
    })
      .populate("projectId", "title")
      .sort({ dueDate: 1 })
      .limit(5),
    Task.find({
      assignedTo: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title status updatedAt dueDate"),
  ]);

  res.json({
    success: true,
    data: {
      myTasks,
      completedTasks,
      upcomingDeadlines,
      notifications: notifications.map((task) => ({
        id: task._id,
        message: `${task.title} is currently ${task.status.replace("-", " ")}`,
        timestamp: task.updatedAt,
      })),
    },
  });
};
