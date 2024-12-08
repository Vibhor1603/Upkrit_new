const express = require("express");
const {
  complaintHandle,
  LoginHandler,
  SignupHandler,
  driveHandler,
} = require("../database/database");

// Routes Handlers
const home = (req, res) => res.send("This is the home API route.");
const contact = (req, res) => res.send("This is the contact API route.");
const about = (req, res) => res.send("This is the about API route.");

// Login
const login = async (req, res) => {
  await LoginHandler(req.body, res); // Passing `res` for token setting
};

const createDrive = async (req, res) => {
  await driveHandler(req.body, res);
};
// Signup
const signup = async (req, res) => {
  await SignupHandler(req.body, res); // Passing `res` for token setting
};

// Complaint
const complaint = async (req, res) => {
  try {
    const result = await complaintHandle(req.body);
    res.json(result);
  } catch (err) {
    console.error("Complaint Error:", err);
    res.status(500).json({ error: err.message });
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
  complaint,
  protectedRoute,
  logout,
  createDrive,
};
