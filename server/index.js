const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./Routes/Routes");
const { MONGO_URL, PORT } = process.env;

/*
logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message');
*/

// Ensure required environment variables are present
if (!MONGO_URL || !PORT) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

// Connect to MongoDB with useNewUrlParser and useUnifiedTopology
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const app = express();

const winston = require("winston");

// Configure Winston transports (you can customize as needed)
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Use the logger in your application
app.use((req, res, next) => {
  // Log HTTP requests
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware with logging
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://wellick.cz/"], // Add other allowed origins as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Serve static files (assuming your React build is in the 'public' directory)
app.use(express.static("public"));

// Define your routes
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
