const express = require('express');
const { requireUser } = require('./middleware/auth.js');
const { asyncHandler } = require('../utils/errorHandler');
const { ErrorTypes } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/services
 * Get all services
 * This is a public endpoint that doesn't require authentication
 */
router.get('/', asyncHandler(async (req, res) => {
  logger.info('Getting all services');
  
  // In a real implementation, this would call a service service
  // const services = await serviceService.getAllServices();
  
  // Mock response
  const services = [
    {
      _id: '1',
      name: 'Classic Haircut',
      nameEn: 'Classic Haircut',
      nameTr: 'Klasik Saç Kesimi',
      description: 'Professional haircut with styling',
      descriptionEn: 'Professional haircut with styling',
      descriptionTr: 'Şekillendirme ile profesyonel saç kesimi',
      duration: 30,
      price: 50,
      category: 'haircut',
      isActive: true
    },
    {
      _id: '2',
      name: 'Beard Trim',
      nameEn: 'Beard Trim',
      nameTr: 'Sakal Düzeltme',
      description: 'Professional beard trimming and shaping',
      descriptionEn: 'Professional beard trimming and shaping',
      descriptionTr: 'Profesyonel sakal kesimi ve şekillendirme',
      duration: 20,
      price: 30,
      category: 'beard',
      isActive: true
    },
    {
      _id: '3',
      name: 'Classic Shave',
      nameEn: 'Classic Shave',
      nameTr: 'Klasik Tıraş',
      description: 'Traditional hot towel shave',
      descriptionEn: 'Traditional hot towel shave',
      descriptionTr: 'Geleneksel sıcak havlu tıraşı',
      duration: 25,
      price: 40,
      category: 'shave',
      isActive: true
    },
    {
      _id: '4',
      name: 'Hair Styling',
      nameEn: 'Hair Styling',
      nameTr: 'Saç Şekillendirme',
      description: 'Professional hair styling and finishing',
      descriptionEn: 'Professional hair styling and finishing',
      descriptionTr: 'Profesyonel saç şekillendirme ve bitirme',
      duration: 20,
      price: 35,
      category: 'styling',
      isActive: true
    },
    {
      _id: '5',
      name: 'Complete Package',
      nameEn: 'Complete Package',
      nameTr: 'Komple Paket',
      description: 'Haircut, beard trim, and styling',
      descriptionEn: 'Haircut, beard trim, and styling',
      descriptionTr: 'Saç kesimi, sakal düzeltme ve şekillendirme',
      duration: 60,
      price: 100,
      category: 'package',
      isActive: true
    }
  ];
  
  res.status(200).json({
    success: true,
    data: {
      services,
      total: services.length,
      page: 1,
      limit: 10
    }
  });
}));

/**
 * GET /api/services/:id
 * Get a service by ID
 * This is a public endpoint that doesn't require authentication
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info(`Getting service with ID ${id}`);
  
  // In a real implementation, this would call a service service
  // const service = await serviceService.getServiceById(id);
  // if (!service) {
  //   throw ErrorTypes.NOT_FOUND(`Service with ID ${id} not found`);
  // }
  
  // Mock response
  const service = {
    _id: id,
    name: 'Classic Haircut',
    nameEn: 'Classic Haircut',
    nameTr: 'Klasik Saç Kesimi',
    description: 'Professional haircut with styling',
    descriptionEn: 'Professional haircut with styling',
    descriptionTr: 'Şekillendirme ile profesyonel saç kesimi',
    duration: 30,
    price: 50,
    category: 'haircut',
    isActive: true
  };
  
  res.status(200).json({
    success: true,
    data: {
      service
    }
  });
}));

/**
 * GET /api/services/category/:category
 * Get services by category
 * This is a public endpoint that doesn't require authentication
 */
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  logger.info(`Getting services in category ${category}`);
  
  // In a real implementation, this would call a service service
  // const services = await serviceService.getServicesByCategory(category);
  
  // Mock response
  const services = [
    {
      _id: '1',
      name: 'Classic Haircut',
      nameEn: 'Classic Haircut',
      nameTr: 'Klasik Saç Kesimi',
      description: 'Professional haircut with styling',
      descriptionEn: 'Professional haircut with styling',
      descriptionTr: 'Şekillendirme ile profesyonel saç kesimi',
      duration: 30,
      price: 50,
      category: category,
      isActive: true
    }
  ];
  
  res.status(200).json({
    success: true,
    data: {
      services,
      category,
      total: services.length
    }
  });
}));

/**
 * POST /api/services
 * Create a new service
 * This is a private endpoint that requires admin authentication
 */
router.post('/', requireUser, asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.user.role || req.user.role !== 'admin') {
    throw ErrorTypes.FORBIDDEN('Only admins can create services');
  }
  
  const { 
    name, nameEn, nameTr, 
    description, descriptionEn, descriptionTr, 
    duration, price, category 
  } = req.body;
  
  // Validate required fields
  if (!name || !duration || !price || !category) {
    throw ErrorTypes.BAD_REQUEST('Missing required fields: name, duration, price, category');
  }
  
  logger.info(`Creating new service: ${name}`);
  
  // In a real implementation, this would call a service service
  // const service = await serviceService.createService({
  //   name, nameEn, nameTr, 
  //   description, descriptionEn, descriptionTr, 
  //   duration, price, category,
  //   isActive: true
  // });
  
  // Mock response
  const service = {
    _id: Date.now().toString(),
    name,
    nameEn: nameEn || name,
    nameTr: nameTr || name,
    description: description || '',
    descriptionEn: descriptionEn || description || '',
    descriptionTr: descriptionTr || description || '',
    duration,
    price,
    category,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: {
      service
    }
  });
}));

/**
 * PUT /api/services/:id
 * Update a service
 * This is a private endpoint that requires admin authentication
 */
router.put('/:id', requireUser, asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.user.role || req.user.role !== 'admin') {
    throw ErrorTypes.FORBIDDEN('Only admins can update services');
  }
  
  const { id } = req.params;
  const { 
    name, nameEn, nameTr, 
    description, descriptionEn, descriptionTr, 
    duration, price, category, isActive 
  } = req.body;
  
  logger.info(`Updating service ${id}`);
  
  // In a real implementation, this would call a service service
  // const service = await serviceService.getServiceById(id);
  // if (!service) {
  //   throw ErrorTypes.NOT_FOUND(`Service with ID ${id} not found`);
  // }
  // 
  // const updatedService = await serviceService.updateService(id, {
  //   name, nameEn, nameTr, 
  //   description, descriptionEn, descriptionTr, 
  //   duration, price, category, isActive
  // });
  
  // Mock response
  const service = {
    _id: id,
    name: name || 'Classic Haircut',
    nameEn: nameEn || name || 'Classic Haircut',
    nameTr: nameTr || name || 'Klasik Saç Kesimi',
    description: description || 'Professional haircut with styling',
    descriptionEn: descriptionEn || description || 'Professional haircut with styling',
    descriptionTr: descriptionTr || description || 'Şekillendirme ile profesyonel saç kesimi',
    duration: duration || 30,
    price: price || 50,
    category: category || 'haircut',
    isActive: isActive !== undefined ? isActive : true,
    updatedAt: new Date().toISOString()
  };
  
  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: {
      service
    }
  });
}));

/**
 * DELETE /api/services/:id
 * Delete a service (soft delete by setting isActive to false)
 * This is a private endpoint that requires admin authentication
 */
router.delete('/:id', requireUser, asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.user.role || req.user.role !== 'admin') {
    throw ErrorTypes.FORBIDDEN('Only admins can delete services');
  }
  
  const { id } = req.params;
  logger.info(`Deleting service ${id}`);
  
  // In a real implementation, this would call a service service
  // const service = await serviceService.getServiceById(id);
  // if (!service) {
  //   throw ErrorTypes.NOT_FOUND(`Service with ID ${id} not found`);
  // }
  // 
  // await serviceService.deleteService(id);
  
  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
    data: {
      message: 'Service deleted successfully',
      serviceId: id
    }
  });
}));

module.exports = router;