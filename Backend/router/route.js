const express = require("express");
const router = express.Router();
const {
  home,
  contact,
  about,
  getAllComplaint,
  postComplaint,
  getComplaintByUserId,
  login,
  signup, // Middleware for authentication
  protectedRoute,
  logout,
  createDrive,
  getDrive,
} = require("../controller/controller");
const authenticateToken = require("../middlewares/AuthenticateToken");

// Public routes
router.route("/home").get(home);
router.route("/about").get(about);
router.route("/contact").get(contact);
router.route("/logout").get(logout);

// Complaint route
router.route("/complaint").post(authenticateToken, postComplaint); // route to post complaint
router.route("/complaint/all").get(authenticateToken, getAllComplaint); // route to get complaint
router
  .route("/complaint/user/:id")
  .get(authenticateToken, getComplaintByUserId); // get complaint by user id

// Drive route
router.route("/drive").post(authenticateToken, createDrive); // create drive
router.route("/drive/all").get(authenticateToken, getDrive); // create drive

// Authentication routes
router.route("/login").post(login);
router.route("/signup").post(signup);

// Example protected route
router.route("/protected").get(authenticateToken, protectedRoute);

module.exports = router;
