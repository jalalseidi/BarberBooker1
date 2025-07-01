// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
// const session = require("express-session"); // Uncomment if session management is needed
// const MongoStore = require('connect-mongo'); // Uncomment if session store is needed
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const barberRoutes = require("./routes/barberRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const { connectDB } = require("./config/database");
const cors = require("cors");
const logger = require("./utils/logger");

if (!process.env.DATABASE_URL) {
  logger.error("Error: DATABASE_URL variable in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check if MongoDB is installed and running
const { exec } = require('child_process');

// Database connection - async IIFE to ensure MongoDB is connected before starting the server
(async () => {
  try {
    // Check if MongoDB is running (platform-specific)
    if (process.platform === 'win32') {
      logger.info('Checking if MongoDB is running on Windows...');
      exec('sc query MongoDB', (error, stdout) => {
        if (error || stdout.includes('STOPPED')) {
          logger.warn('MongoDB service might not be running. Please start MongoDB before using this application.');
          logger.warn('You can start MongoDB by running: net start MongoDB');
        } else if (stdout.includes('RUNNING')) {
          logger.info('MongoDB service appears to be running.');
        }
      });
    } else if (process.platform === 'linux' || process.platform === 'darwin') {
      logger.info(`Checking if MongoDB is running on ${process.platform}...`);
      exec('pgrep mongod', (error) => {
        if (error) {
          logger.warn('MongoDB process might not be running. Please start MongoDB before using this application.');
          logger.warn('You can start MongoDB by running: sudo service mongod start (Linux) or brew services start mongodb-community (macOS)');
        } else {
          logger.info('MongoDB process appears to be running.');
        }
      });
    }

    // Attempt to connect to MongoDB
    logger.info('Attempting to connect to MongoDB database...');
    await connectDB();
    logger.info('MongoDB connection established successfully');

    // Start the server only after successful database connection
    app.listen(port, () => {
      logger.info(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB. Server will not start.');
    logger.error(`Error details: ${error.message}`);

    // Provide helpful instructions based on the error
    if (error.name === 'MongoServerSelectionError') {
      logger.error('\nPossible solutions:');
      logger.error('1. Make sure MongoDB is installed and running');
      logger.error('2. Check if the MongoDB connection string in .env file is correct');
      logger.error('3. Verify that MongoDB is listening on the specified port');

      if (process.platform === 'win32') {
        logger.error('\nOn Windows, you can:');
        logger.error('- Check MongoDB service status: sc query MongoDB');
        logger.error('- Start MongoDB service: net start MongoDB');
      } else if (process.platform === 'linux') {
        logger.error('\nOn Linux, you can:');
        logger.error('- Check MongoDB service status: sudo systemctl status mongod');
        logger.error('- Start MongoDB service: sudo systemctl start mongod');
      } else if (process.platform === 'darwin') {
        logger.error('\nOn macOS, you can:');
        logger.error('- Check MongoDB service status: brew services list | grep mongodb');
        logger.error('- Start MongoDB service: brew services start mongodb-community');
      }
    }

    process.exit(1);
  }
})();

app.on("error", (error) => {
  logger.error(`Server error: ${error.message}`);
  logger.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// Barber Routes
app.use('/api/barbers', barberRoutes);
// Booking Routes
app.use('/api/bookings', bookingRoutes);
// Service Routes
app.use('/api/services', serviceRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  const { ErrorTypes } = require('./utils/errorHandler');
  next(ErrorTypes.NOT_FOUND(`Route ${req.originalUrl} not found`));
});

// Global error handling middleware
const { errorMiddleware } = require('./utils/errorHandler');
app.use(errorMiddleware);

// Server is started in the async IIFE above after MongoDB connection is established
