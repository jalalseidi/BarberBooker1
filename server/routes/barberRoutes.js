const express = require('express');
const { requireUser } = require('./middleware/auth.js');
const { asyncHandler } = require('../utils/errorHandler');
const { ErrorTypes } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route GET /api/barbers
 * @desc Get all barbers
 * @access Public
 */
router.get('/', asyncHandler(async (req, res) => {
  logger.info('Getting all barbers');
  
  // In a real implementation, this would call a barber service
  // const barbers = await barberService.getAllBarbers();
  
  // Mock response
  const barbers = [
    {
      _id: '1',
      name: 'Mehmet Özkan',
      email: 'mehmet@barbershop.com',
      specialties: ['haircut', 'beard', 'styling'],
      bio: 'Expert barber with 10+ years experience',
      bioEn: 'Expert barber with 10+ years experience',
      bioTr: '10+ yıl deneyimli uzman berber',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 127,
      isAvailable: true,
      workingHours: {
        start: '09:00',
        end: '18:00'
      }
    },
    {
      _id: '2',
      name: 'Ali Demir',
      email: 'ali@barbershop.com',
      specialties: ['haircut', 'shave'],
      bio: 'Traditional barber specializing in classic cuts',
      bioEn: 'Traditional barber specializing in classic cuts',
      bioTr: 'Klasik kesimler konusunda uzmanlaşmış geleneksel berber',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.6,
      reviewCount: 89,
      isAvailable: true,
      workingHours: {
        start: '10:00',
        end: '19:00'
      }
    },
    {
      _id: '3',
      name: 'Emre Kaya',
      email: 'emre@barbershop.com',
      specialties: ['styling', 'treatment'],
      bio: 'Modern styling expert and hair treatment specialist',
      bioEn: 'Modern styling expert and hair treatment specialist',
      bioTr: 'Modern şekillendirme uzmanı ve saç bakım uzmanı',
      profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 156,
      isAvailable: false,
      workingHours: {
        start: '08:00',
        end: '17:00'
      }
    }
  ];
  
  res.status(200).json({
    success: true,
    data: {
      barbers,
      total: barbers.length,
      page: 1,
      limit: 10
    }
  });
}));

/**
 * @route GET /api/barbers/:id
 * @desc Get a barber by ID
 * @access Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info(`Getting barber with ID ${id}`);
  
  // In a real implementation, this would call a barber service
  // const barber = await barberService.getBarberById(id);
  // if (!barber) {
  //   throw ErrorTypes.NOT_FOUND(`Barber with ID ${id} not found`);
  // }
  
  // Mock response
  const barber = {
    _id: id,
    name: 'Mehmet Özkan',
    email: 'mehmet@barbershop.com',
    specialties: ['haircut', 'beard', 'styling'],
    bio: 'Expert barber with 10+ years experience',
    bioEn: 'Expert barber with 10+ years experience',
    bioTr: '10+ yıl deneyimli uzman berber',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    reviewCount: 127,
    isAvailable: true,
    workingHours: {
      start: '09:00',
      end: '18:00'
    }
  };
  
  res.status(200).json({
    success: true,
    data: {
      barber
    }
  });
}));

/**
 * @route GET /api/barbers/:id/availability
 * @desc Get a barber's availability for a specific date
 * @access Public
 */
router.get('/:id/availability', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, serviceId } = req.query;
  
  if (!date) {
    throw ErrorTypes.BAD_REQUEST('Date is required');
  }
  
  logger.info(`Getting availability for barber ${id} on ${date}`);
  
  // In a real implementation, this would call a barber service
  // const availableSlots = await barberService.getBarberAvailability(id, date, serviceId);
  
  // Mock response
  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  
  res.status(200).json({
    success: true,
    data: {
      availableSlots,
      date,
      barberId: id
    }
  });
}));

/**
 * @route GET /api/barbers/:id/reviews
 * @desc Get reviews for a barber
 * @access Public
 */
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  logger.info(`Getting reviews for barber ${id}`);
  
  // In a real implementation, this would call a barber service
  // const reviews = await barberService.getBarberReviews(id, { page, limit });
  
  // Mock response
  const reviews = [
    {
      _id: '1',
      barberId: id,
      customerId: 'user1',
      customerName: 'John Doe',
      rating: 5,
      comment: 'Great haircut, very professional!',
      createdAt: '2024-01-05T10:00:00Z'
    },
    {
      _id: '2',
      barberId: id,
      customerId: 'user2',
      customerName: 'Jane Smith',
      rating: 4,
      comment: 'Good service, but a bit rushed.',
      createdAt: '2024-01-10T14:30:00Z'
    }
  ];
  
  res.status(200).json({
    success: true,
    data: {
      reviews,
      total: reviews.length,
      page: parseInt(page),
      limit: parseInt(limit),
      averageRating: 4.5
    }
  });
}));

/**
 * @route POST /api/barbers/:id/reviews
 * @desc Create a review for a barber
 * @access Private
 */
router.post('/:id/reviews', requireUser, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    throw ErrorTypes.BAD_REQUEST('Rating is required and must be between 1 and 5');
  }
  
  logger.info(`Creating review for barber ${id} by user ${req.user.id}`);
  
  // In a real implementation, this would call a barber service
  // const review = await barberService.createBarberReview(id, req.user.id, { rating, comment });
  
  // Mock response
  const review = {
    _id: Date.now().toString(),
    barberId: id,
    customerId: req.user.id,
    customerName: req.user.name || 'Anonymous',
    rating,
    comment,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: {
      review,
      message: 'Review created successfully'
    }
  });
}));

module.exports = router;