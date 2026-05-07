import crypto from "crypto";
import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";

const buildAuthResponse = (user, rememberMe = true) => {
  const token = generateToken({ id: user._id, role: user.role });

  return {
    user,
    token,
    rememberMe,
  };
};

export const register = async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    return next(new AppError("Email is already registered", 409));
  }

  const user = await User.create({
    ...req.body,
    role: "user",
  });
  const safeUser = await User.findById(user._id).select("-password");

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: buildAuthResponse(safeUser),
  });
};

export const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");

  if (!user || !(await user.comparePassword(req.body.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  user.lastActiveAt = new Date();
  await user.save({ validateBeforeSave: false });

  const safeUser = await User.findById(user._id).select("-password");
  const data = buildAuthResponse(safeUser, req.body.rememberMe);

  res.cookie("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: req.body.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: "Login successful",
    data,
  });
};

export const logout = async (_req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "Logout successful",
  });
};

export const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};

export const updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json({
    success: true,
    message: "Profile updated",
    data: user,
  });
};

export const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("No account found with this email", 404));
  }

  const token = crypto.randomBytes(24).toString("hex");

  await PasswordResetToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  res.json({
    success: true,
    message: "Reset token generated. Use this in the reset password form.",
    data: {
      resetToken: token,
      note: "In production, send this token by email.",
    },
  });
};

export const resetPassword = async (req, res, next) => {
  const resetRecord = await PasswordResetToken.findOne({
    token: req.body.token,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    return next(new AppError("Reset token is invalid or expired", 400));
  }

  const user = await User.findById(resetRecord.userId).select("+password");
  user.password = req.body.password;
  await user.save();
  await PasswordResetToken.deleteMany({ userId: user._id });

  res.json({
    success: true,
    message: "Password reset successful. Please login again.",
  });
};
