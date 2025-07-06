const express = require('express');
const { requireUser } = require('./middleware/auth.js');
const { asyncHandler } = require('../utils/errorHandler');
const { ErrorTypes } = require('../utils/errorHandler');
const logger = require('../utils/logger');
const container = require('../services');

const router = express.Router();

// Get the booking service instance
const bookingService = container.get('bookingService');

/**
 * @route GET /api/bookings
 * @desc Get all bookings for the current user
 * @access Private
 */
router.get('/', requireUser, asyncHandler(async (req, res) => {
  logger.info(`Getting bookings for user ${req.user.id}`);
  
  // Extract query parameters for filtering and pagination
  const { status, date, barberId, page = 1, limit = 10 } = req.query;
  
  const filterOpts = {
    status,
    date,
    barberId,
    page: parseInt(page),
    limit: parseInt(limit)
  };
  
  // Get bookings from the service
  const result = await bookingService.getBookingsByUser(req.user.id, filterOpts);
  
  res.status(200).json({
    success: true,
    data: {
      bookings: result.bookings,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
}));

/**
 * @route GET /api/bookings/:id
 * @desc Get a booking by ID
 * @access Private
 */
router.get('/:id', requireUser, asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info(`Getting booking ${id} for user ${req.user.id}`);
  
  // Get booking from the service
  const booking = await bookingService.getBookingById(id, req.user.id);
  
  if (!booking) {
    throw ErrorTypes.NOT_FOUND(`Booking with ID ${id} not found`);
  }
  
  res.status(200).json({
    success: true,
    data: {
      booking
    }
  });
}));

/**
 * @route POST /api/bookings
 * @desc Create a new booking
 * @access Private
 */
router.post('/', requireUser, asyncHandler(async (req, res) => {
  const { barberId, serviceId, date, time, specialRequests } = req.body;
  logger.info(`Creating booking for user ${req.user.id}`);
  logger.info(`Request body:`, req.body);
  logger.info(`Received serviceId: ${serviceId}, barberId: ${barberId}`);
  
  // Validate required fields
  if (!barberId || !serviceId || !date || !time) {
    throw ErrorTypes.BAD_REQUEST('Missing required fields: barberId, serviceId, date, time');
  }
  
  // Create booking using the service
  const booking = await bookingService.createBooking({
    customerId: req.user.id,
    barberId,
    serviceId,
    date,
    time,
    specialRequests
  });
  
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking,
      message: 'Booking created successfully'
    }
  });
}));

/**
 * @route PUT /api/bookings/:id
 * @desc Update a booking
 * @access Private
 */
router.put('/:id', requireUser, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { barberId, serviceId, date, time, status, specialRequests } = req.body;
  logger.info(`Updating booking ${id} for user ${req.user.id}`);
  
  // Update booking using the service
  const booking = await bookingService.updateBooking(id, req.user.id, {
    barberId,
    serviceId,
    date,
    time,
    status,
    specialRequests
  });
  
  if (!booking) {
    throw ErrorTypes.NOT_FOUND(`Booking with ID ${id} not found`);
  }
  
  res.status(200).json({
    success: true,
    message: 'Booking updated successfully',
    data: {
      booking,
      message: 'Booking updated successfully'
    }
  });
}));

/**
 * @route DELETE /api/bookings/:id
 * @desc Cancel a booking
 * @access Private
 */
router.delete('/:id', requireUser, asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info(`Cancelling booking ${id} for user ${req.user.id}`);
  
  // Cancel booking using the service
  const booking = await bookingService.cancelBooking(id, req.user.id);
  
  if (!booking) {
    throw ErrorTypes.NOT_FOUND(`Booking with ID ${id} not found`);
  }
  
  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      message: 'Booking cancelled successfully',
      bookingId: id
    }
  });
}));

module.exports = router;