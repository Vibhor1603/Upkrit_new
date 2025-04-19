const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key"; // Use environment variables in production

mongoose
  .connect(
    "mongodb+srv://vibhorsharmak:Avishubhi1603@cluster0.ygkeq.mongodb.net/UPKRIT?retryWrites=true&w=majority",
    {}
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));
// Complaint Schema
const complaintSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  type: { type: String, trim: true },
  description: { type: String, trim: true },
  date: { type: Date },
  location: { type: String, trim: true },
  media: { type: String }, // Stores file path or URL
});

// Account Schema
const AccountSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, unique: true },
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
});

// const DriveSchema = new mongoose.Schema({
//   username: { type: String, required: true, trim: true },
//   type: { type: String, required: true, trim: true },
//   date: { type: Date },
//   abstract: { type: String, required: true, trim: true },
//   location: { type: String, required: true, trim: true },
// });

// Models
const Complaint = mongoose.model("Complaint", complaintSchema);
const Account = mongoose.model("Account", AccountSchema);

const driveHandler = async (data, res) => {
  try {
    // Validate required fields
    const { username, type, abstract, location } = data;
    if (!username || !type || !abstract || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new Drive entry
    const newDrive = new mongoose.model("Drive", DriveSchema)({
      username: username.trim(),
      type: type.trim(),
      date: data.date || new Date(), // Use provided date or current date
      abstract: abstract.trim(),
      location: location.trim(),
    });

    // Save the drive to the database
    const result = await newDrive.save();

    // Return success response
    return res.status(201).json({
      message: "Drive added successfully",
      drive: result,
    });
  } catch (error) {
    console.error("Drive insertion error:", error);

    // Return error response
    return res.status(500).json({
      message: "Server issue while adding drive",
      error,
    });
  }
};

// Signup Handler
const SignupHandler = async (data, res) => {
  try {
    // Check if user already exists
    const existingUser = await Account.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        isAuthenticated: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create and save account
    const account = new Account({
      email: data.email,
      username: data.username,
      password: hashedPassword,
    });
    await account.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: account._id, email: account.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set JWT in cookies
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      message: "User added successfully",
      isAuthenticated: true,
      user: data.username,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Server issue", error, isAuthenticated: false });
  }
};

// Login Handler
const LoginHandler = async (data, res) => {
  try {
    const account = await Account.findOne({ email: data.email });
    if (!account) {
      return res
        .status(404)
        .json({ message: "User does not exist", isAuthenticated: false });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      data.password,
      account.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid password", isAuthenticated: false });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: account._id, email: account.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set JWT in cookies
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "none",
    });

    // Send response with username
    return res.status(200).json({
      message: "Login successful",
      isAuthenticated: true,
      user: account.username, // Include the username here
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server issue", error });
  }
};

// Complaint Handler
const postComplaintHandler = async (data) => {
  try {
    const newComplaint = new Complaint(data);
    const result = await newComplaint.save();
    return { message: "Successfully inserted data", result };
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
};
// get all complaint 
const getAllComplaintHandler = async () => {
  try {
    const complaints = await Complaint.find();
    return { message: "Successfully fetched complaints", complaints };
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }
};

module.exports = { postComplaintHandler, getAllComplaintHandler, LoginHandler, SignupHandler, driveHandler };
