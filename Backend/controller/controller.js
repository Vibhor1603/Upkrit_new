const express = require("express");
const {
  postComplaintHandler,
  getAllComplaintHandler,
  getComplaintsByUserIdHandler,
  LoginHandler,
  SignupHandler,
  driveHandler,
  getAllDrivesHandler,
} = require("../database/database");

// Routes Handlers
const home = (req, res) => res.send("This is the home API route.");
const contact = (req, res) => res.send("This is the contact API route.");
const about = (req, res) => res.send("This is the about API route.");

// Login
const login = async (req, res) => {
  await LoginHandler(req.body, res); // Passing `res` for token setting
};
// Signup
const signup = async (req, res) => {
  await SignupHandler(req.body, res); // Passing `res` for token setting
};

// ================================================controller for drive feature
//post complaint
const createDrive = async (req, res) => {
  try {
    await driveHandler(req.body, res);
  } catch (error) {
    console.error("Drive creation Error:", err);
    res.status(500).json({ error: err.message });
  }
};
//get all drives
const getDrive = async (req, res) => {
  try {
    const drives = await getAllDrivesHandler();
    res.status(200).json(drives);
  } catch (error) {
    console.error("Drive fetching Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================================================controller for complaint feature
// post Complaint
const postComplaint = async (req, res) => {
  try {
    const result = await postComplaintHandler(req.body);
    res.json(result);
  } catch (err) {
    console.error("Complaint Error:", err);
    res.status(500).json({ error: err.message });
  }
};
// get all complaint
const getAllComplaint = async (req, res) => {
  try {
    const result = await getAllComplaintHandler(req.body);
    res.json(result);
  } catch (err) {
    console.error("Complaint Error:", err);
    res.status(500).json({ error: err.message });
  }
};
// get all complaint by user id
const getComplaintByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const complaints = await getComplaintsByUserIdHandler(userId);
    res
      .status(200)
      .json({ message: "Fetched complaints for user", complaints });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware for JWT Verification

// Example Protected Route
const protectedRoute = (req, res) => {
  res.send(`Welcome to the protected route, ${req.user.email}!`);
};

const logout = (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
module.exports = {
  home,
  contact,
  about,
  login,
  signup,
  getAllComplaint,
  postComplaint,
  getComplaintByUserId,
  protectedRoute,
  logout,
  createDrive,
  getDrive,
};
