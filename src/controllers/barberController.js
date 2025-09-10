const asyncHandler = require('../utils/asyncHandler');
const barberService = require('../services/barberService');
const { validationResult } = require('express-validator');

// @desc    Get all barbers
// @route   GET /api/barbers
// @access  Public
const getBarbers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    isActive,
    search
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
    search
  };

  const result = await barberService.getAllBarbers(options);

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

// @desc    Get active barbers
// @route   GET /api/barbers/active
// @access  Public
const getActiveBarbers = asyncHandler(async (req, res) => {
  const barbers = await barberService.getActiveBarbers();

  res.status(200).json({
    success: true,
    data: barbers
  });
});

// @desc    Get available barbers
// @route   GET /api/barbers/available
// @access  Public
const getAvailableBarbers = asyncHandler(async (req, res) => {
  const { date, time } = req.query;
  const barbers = await barberService.getAvailableBarbers(date, time);

  res.status(200).json({
    success: true,
    data: barbers
  });
});

// @desc    Get single barber
// @route   GET /api/barbers/:id
// @access  Public
const getBarber = asyncHandler(async (req, res) => {
  const barber = await barberService.getBarberById(req.params.id);

  res.status(200).json({
    success: true,
    data: barber
  });
});

// @desc    Create barber
// @route   POST /api/barbers
// @access  Private (Admin)
const createBarber = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const barber = await barberService.createBarber(req.body);

  res.status(201).json({
    success: true,
    message: 'Barber created successfully',
    data: barber
  });
});

// @desc    Update barber
// @route   PUT /api/barbers/:id
// @access  Private (Admin)
const updateBarber = asyncHandler(async (req, res) => {
  const barber = await barberService.updateBarber(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Barber updated successfully',
    data: barber
  });
});

// @desc    Delete barber
// @route   DELETE /api/barbers/:id
// @access  Private (Admin)
const deleteBarber = asyncHandler(async (req, res) => {
  await barberService.deleteBarber(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Barber deleted successfully'
  });
});

// @desc    Toggle barber status
// @route   PATCH /api/barbers/:id/toggle-status
// @access  Private (Admin)
const toggleBarberStatus = asyncHandler(async (req, res) => {
  const barber = await barberService.toggleBarberStatus(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Barber status updated successfully',
    data: barber
  });
});

// @desc    Update barber working hours
// @route   PUT /api/barbers/:id/working-hours
// @access  Private (Admin)
const updateWorkingHours = asyncHandler(async (req, res) => {
  const { workingHours } = req.body;
  const barber = await barberService.updateWorkingHours(req.params.id, workingHours);

  res.status(200).json({
    success: true,
    message: 'Working hours updated successfully',
    data: barber
  });
});

// @desc    Update barber rating
// @route   POST /api/barbers/:id/rating
// @access  Private
const updateRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  const barber = await barberService.updateRating(req.params.id, rating);

  res.status(200).json({
    success: true,
    message: 'Rating updated successfully',
    data: barber
  });
});

module.exports = {
  getBarbers,
  getActiveBarbers,
  getAvailableBarbers,
  getBarber,
  createBarber,
  updateBarber,
  deleteBarber,
  toggleBarberStatus,
  updateWorkingHours,
  updateRating
};