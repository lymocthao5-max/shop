const asyncHandler = require('../utils/asyncHandler');
const serviceService = require('../services/serviceService');
const { validationResult } = require('express-validator');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    isActive,
    popular,
    search
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    category,
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
    popular: popular !== undefined ? popular === 'true' : undefined,
    search
  };

  const result = await serviceService.getAllServices(options);

  res.status(200).json({
    success: true,
    data: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.count,
      pages: Math.ceil(result.count / limit)
    }
  });
});

// @desc    Get active services
// @route   GET /api/services/active
// @access  Public
const getActiveServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getActiveServices();

  res.status(200).json({
    success: true,
    data: services
  });
});

// @desc    Get popular services
// @route   GET /api/services/popular
// @access  Public
const getPopularServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getPopularServices();

  res.status(200).json({
    success: true,
    data: services
  });
});

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
const getServicesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const services = await serviceService.getServicesByCategory(category);

  res.status(200).json({
    success: true,
    data: services
  });
});

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await serviceService.getCategories();

  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Create service
// @route   POST /api/services
// @access  Private (Admin)
const createService = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const service = await serviceService.createService(req.body);

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully'
  });
});

// @desc    Toggle service status
// @route   PATCH /api/services/:id/toggle-status
// @access  Private (Admin)
const toggleServiceStatus = asyncHandler(async (req, res) => {
  const service = await serviceService.toggleServiceStatus(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service status updated successfully',
    data: service
  });
});

// @desc    Toggle popular status
// @route   PATCH /api/services/:id/toggle-popular
// @access  Private (Admin)
const togglePopularStatus = asyncHandler(async (req, res) => {
  const service = await serviceService.togglePopularStatus(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service popular status updated successfully',
    data: service
  });
});

module.exports = {
  getServices,
  getActiveServices,
  getPopularServices,
  getServicesByCategory,
  getCategories,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  togglePopularStatus
};