const jwt = require("jsonwebtoken"); // Ensure jwt is installed and required
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Replace with your secure secret key

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken; // Get token from cookies
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = verified; // Attach user info to request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
