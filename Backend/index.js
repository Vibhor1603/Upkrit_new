const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const router = require("./router/route");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: "http://localhost:5173", // Allow only this origin
  credentials: true, // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.use("/", router);

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

process.on("SIGINT", () => {
  console.log("Gracefully shutting down...");
  server.close(() => {
    console.log("Server shut down");
    process.exit(0); // Ensure the process exits cleanly
  });
});
