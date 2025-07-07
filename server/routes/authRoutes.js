const express = require('express');
const serviceContainer = require('../services');
const { requireUser } = require('./middleware/auth.js');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth.js');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const Barber = require('../models/Barber');

// Get the userService instance from the container
const userService = serviceContainer.get('userService');

const router = express.Router();

router.post('/login', async (req, res) => {
  const sendError = msg => res.status(400).json({ message: msg });
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError('Email and password are required');
  }

  const user = await userService.authenticateWithPassword(email, password);

  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    return res.json({...user.toObject(), accessToken, refreshToken});
  } else {
    return sendError('Email or password is incorrect');

  }
});

router.post('/register', async (req, res, next) => {
  if (req.user) {
    return res.json({ user: req.user });
  }
  try {
    const user = await userService.create(req.body);
    
    // If user registered as a barber, create a Barber document
    if (req.body.role === 'barber') {
      try {
        const barberData = {
          name: req.body.name || `${req.body.firstName} ${req.body.lastName}`.trim(),
          email: req.body.email,
          phone: req.body.phone || '',
          specialties: req.body.specialties || [],
          availability: req.body.availability || {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '09:00', end: '17:00', available: true },
            sunday: { start: '09:00', end: '17:00', available: false }
          },
          pricing: req.body.pricing || {
            haircut: 25,
            shampoo: 15,
            shave: 20,
            styling: 30
          },
          userId: user._id
        };
        
        const barber = new Barber(barberData);
        await barber.save();
        
        logger.info(`Barber document created for user: ${user.email}`);
      } catch (barberError) {
        logger.error(`Error creating barber document: ${barberError}`);
        // Don't fail the registration if barber creation fails
        // The user account is already created successfully
      }
    }
    
    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Error while registering user: ${error}`);
    return res.status(400).json({ error });
  }
});

router.post('/logout', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.getByEmail(email);
    if (user) {
      // Use mongoose directly to update the user document
      const User = require('../models/User');
      await User.updateOne(
        { _id: user._id },
        { $unset: { refreshToken: "" } }
      );
    }

    res.status(200).json({ message: 'User logged out successfully.' });
  } catch (error) {
    logger.error(`Error during logout: ${error}`);
    res.status(500).json({ message: 'An error occurred during logout' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user
    const user = await userService.get(decoded.sub);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update user's refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Return new tokens
    return res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Refresh token has expired'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

router.get('/me', requireUser, async (req, res) => {
  return res.status(200).json(req.user);
});

router.get('/profile', requireUser, async (req, res) => {
  return res.status(200).json(req.user);
});

router.delete('/delete-account', requireUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    // If user is a barber, delete the barber document first
    if (userRole === 'barber') {
      try {
        await Barber.deleteOne({ userId: userId });
        logger.info(`Barber document deleted for user: ${req.user.email}`);
      } catch (barberError) {
        logger.error(`Error deleting barber document: ${barberError}`);
        // Continue with user deletion even if barber deletion fails
      }
    }
    
    // Delete the user account
    await userService.delete(userId);
    
    logger.info(`User account deleted: ${req.user.email}`);
    
    return res.status(200).json({ 
      success: true,
      message: 'Account deleted successfully' 
    });
    
  } catch (error) {
    logger.error(`Error deleting account: ${error}`);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while deleting the account' 
    });
  }
});

module.exports = router;
