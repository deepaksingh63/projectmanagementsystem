import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([Task.deleteMany({}), Project.deleteMany({}), User.deleteMany({})]);

  const [admin, userOne, userTwo] = await User.create([
    {
      name: "Admin Lead",
      email: "admin@ethara.ai",
      password: "Admin123",
      role: "admin",
      title: "Operations Lead",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Aarav Khan",
      email: "aarav@ethara.ai",
      password: "User1234",
      role: "user",
      title: "Frontend Engineer",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      name: "Meera Joshi",
      email: "meera@ethara.ai",
      password: "User1234",
      role: "user",
      title: "Backend Engineer",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
  ]);

  const project = await Project.create({
    title: "Ethara Assessment Platform",
    description: "Create a polished task management platform with dashboards, secure auth and responsive workflows.",
    owner: admin._id,
    members: [userOne._id, userTwo._id],
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    priority: "high",
    status: "in-progress",
  });

  await Task.create([
    {
      title: "Build admin analytics dashboard",
      description: "Add stat cards, charts, recent task table and active user list.",
      assignedTo: userOne._id,
      createdBy: admin._id,
      priority: "high",
      status: "in-progress",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      projectId: project._id,
      comments: [{ message: "Started chart integration.", author: admin._id }],
    },
    {
      title: "Implement secure auth APIs",
      description: "Add JWT login, registration, profile route and role middleware.",
      assignedTo: userTwo._id,
      createdBy: admin._id,
      priority: "high",
      status: "completed",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      projectId: project._id,
      comments: [{ message: "Auth flow is done and tested locally.", author: userTwo._id }],
    },
  ]);

  console.log("Seed complete");
  console.log("Admin login: admin@ethara.ai / Admin123");
  console.log("User login: aarav@ethara.ai / User1234");

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.connection.close();
  process.exit(1);
});
