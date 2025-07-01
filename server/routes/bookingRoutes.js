const express = require('express');
const { requireUser } = require('./middleware/auth.js');
const { asyncHandler } = require('../utils/errorHandler');
const { ErrorTypes } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route GET /api/bookings
 * @desc Get all bookings for the current user
 * @access Private
 */
router.get('/', requireUser, asyncHandler(async (req, res) => {
  // Mock response until we have a booking service
  logger.info(`Getting bookings for user ${req.user.id}`);
  
  // In a real implementation, this would call a booking service
  // const bookings = await bookingService.getBookingsByUser(req.user.id);
  
  const bookings = [
    {
      _id: '1',
      customerId: req.user.id,
      barberId: '1',
      serviceId: '1',
      date: '2024-01-15',
      time: '10:00',
      status: 'confirmed',
      specialRequests: 'Please use scissors only',
      totalPrice: 50,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      _id: '2',
      customerId: req.user.id,
      barberId: '2',
      serviceId: '2',
      date: '2024-01-20',
      time: '14:30',
      status: 'pending',
      totalPrice: 30,
      createdAt: '2024-01-12T15:30:00Z'
    }
  ];
  
  res.status(200).json({
    success: true,
    data: {
      bookings,
      total: bookings.length,
      page: 1,
      limit: 10
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
  
  // In a real implementation, this would call a booking service
  // const booking = await bookingService.getBookingById(id, req.user.id);
  // if (!booking) {
  //   throw ErrorTypes.NOT_FOUND(`Booking with ID ${id} not found`);
  // }
  
  // Mock response
  const booking = {
    _id: id,
    customerId: req.user.id,
    barberId: '1',
    serviceId: '1',
    date: '2024-01-15',
    time: '10:00',
    status: 'confirmed',
    specialRequests: 'Please use scissors only',
    totalPrice: 50,
    createdAt: '2024-01-10T10:00:00Z'
  };
  
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
  
  // Validate required fields
  if (!barberId || !serviceId || !date || !time) {
    throw ErrorTypes.BAD_REQUEST('Missing required fields: barberId, serviceId, date, time');
  }
  
  // In a real implementation, this would call a booking service
  // const booking = await bookingService.createBooking({
  //   customerId: req.user.id,
  //   barberId,
  //   serviceId,
  //   date,
  //   time,
  //   specialRequests
  // });
  
  // Mock response
  const booking = {
    _id: Date.now().toString(),
    customerId: req.user.id,
    barberId,
    serviceId,
    date,
    time,
    status: 'pending',
    specialRequests,
    totalPrice: 50, // This would be calculated based on the service
    createdAt: new Date().toISOString()
  };
  
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
  
  // In a real implementation, this would call a booking service
  // const booking = await bookingService.getBookingById(id, req.user.id);
  // if (!booking) {
  //   throw ErrorTypes.NOT_FOUND(`Booking with ID ${id} not found`);
  // }
  // 
  // const updatedBooking = await bookingService.updateBooking(id, {
  //   barberId,
  //   serviceId,
  //   date,
  //   time,
  //   status,
  //   specialRequests
  // });
  
  // Mock response
  const booking = {
    _id: id,
    customerId: req.user.id,
    barberId: barberId || '1',
    serviceId: serviceId || '1',
    date: date || '2024-01-15',
    time: time || '10:00',
    status: status || 'confirmed',
    specialRequests: specialRequests || 'Please use scissors only',
    totalPrice: 50,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: new Date().toISOString()
  };
  
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
  
  // In a real implementation, this would call a booking service
  // const booking = await bookingService.getBookingById(id, req.user.id);
  // if (!booking) {
  //   throw ErrorTypes.NOT_FOUND(`Booking with ID ${id} not found`);
  // }
  // 
  // await bookingService.cancelBooking(id);
  
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