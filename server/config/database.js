const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Log connection string with credentials masked

    // Add connection options to handle timeouts and retries
    const options = {
      serverSelectionTimeoutMS: 30000, // Timeout for server selection (increased from default 30000ms)
      connectTimeoutMS: 30000, // Timeout for initial connection (increased from default 30000ms)
      socketTimeoutMS: 45000, // Timeout for operations (increased from default 30000ms)
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      minPoolSize: 2, // Minimum number of connections in the connection pool
      retryWrites: true, // Enable retryable writes
      retryReads: true, // Enable retryable reads
    };

    console.log('Connection options:', JSON.stringify(options, null, 2));

    const startTime = Date.now();
    console.log(`Starting MongoDB connection at ${new Date().toISOString()}`);

    const conn = await mongoose.connect(process.env.DATABASE_URL, options);

    console.log(`MongoDB connection established in ${Date.now() - startTime}ms`);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Error handling after initial connection
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB shutdown:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('MongoDB connection failed:');
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);

    // Provide more specific error messages based on the error type
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB server. Please check that MongoDB is running.');
    } else if (error.name === 'MongoNetworkError') {
      console.error('Network error occurred while connecting to MongoDB. Please check your network connection.');
    } else if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string. Please check your DATABASE_URL in .env file.');
    }

    // Rethrow the error to be caught by the server.js error handler
    throw error;
  }
};

module.exports = {
  connectDB,
};
