const express = require("express");
const router = express.Router();
const {
  home,
  contact,
  about,
  complaint,
  login,
  signup, // Middleware for authentication
  protectedRoute,
  logout,
  createDrive, // Example protected route
} = require("../controller/controller");
const authenticateToken = require("../middlewares/AuthenticateToken");

// Public routes
router.route("/home").get(home);
router.route("/about").get(about);
router.route("/contact").get(contact);
router.route("/logout").get(logout);

// Complaint route
router.route("/complaint").post(authenticateToken, complaint); // Protected route (requires authentication)

// Authentication routes
router.route("/login").post(login);
router.route("/signup").post(signup);

// Example protected route
router.route("/protected").get(authenticateToken, protectedRoute);

module.exports = router;
