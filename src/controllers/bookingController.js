const asyncHandler = require('../utils/asyncHandler');
const bookingService = require('../services/bookingService');
const { validationResult } = require('express-validator');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    barberId,
    serviceId,
    userId,
    date,
    search
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    barberId,
    serviceId,
    userId: req.user?.role === 'customer' ? req.user.id : userId,
    date,
    search
  };

  const result = await bookingService.getAllBookings(options);

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

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);

  // Check if user can access this booking
  if (req.user?.role === 'customer' && booking.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this booking'
    });
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Public
const createBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Add user ID if authenticated
  const bookingData = {
    ...req.body,
    userId: req.user?.id || null
  };

  // Ensure bookingDate is in correct format (YYYY-MM-DD)
  if (bookingData.bookingDate) {
    const date = new Date(bookingData.bookingDate);
    bookingData.bookingDate = date.toISOString().split('T')[0];
  }

  // Ensure bookingTime is in correct format (HH:MM:SS)
  if (bookingData.bookingTime && !bookingData.bookingTime.includes(':')) {
    // If time is provided without colons, format it properly
    const time = bookingData.bookingTime.padStart(4, '0');
    bookingData.bookingTime = `${time.slice(0, 2)}:${time.slice(2)}:00`;
  } else if (bookingData.bookingTime && bookingData.bookingTime.split(':').length === 2) {
    // If time is HH:MM, add seconds
    bookingData.bookingTime += ':00';
  }

  const booking = await bookingService.createBooking(bookingData);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);

  // Check if user can update this booking
  if (req.user?.role === 'customer' && booking.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this booking'
    });
  }

  const updatedBooking = await bookingService.updateBooking(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Booking updated successfully',
    data: updatedBooking
  });
});

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);

  // Check if user can cancel this booking
  if (req.user?.role === 'customer' && booking.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this booking'
    });
  }

  const cancelledBooking = await bookingService.cancelBooking(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: cancelledBooking
  });
});

// @desc    Confirm booking
// @route   PATCH /api/bookings/:id/confirm
// @access  Private (Admin/Barber)
const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.confirmBooking(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Booking confirmed successfully',
    data: booking
  });
});

// @desc    Complete booking
// @route   PATCH /api/bookings/:id/complete
// @access  Private (Admin/Barber)
const completeBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.completeBooking(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Booking completed successfully',
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
const deleteBooking = asyncHandler(async (req, res) => {
  await bookingService.deleteBooking(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Booking deleted successfully'
  });
});

// @desc    Get bookings by date range
// @route   GET /api/bookings/date-range
// @access  Private
const getBookingsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Start date and end date are required'
    });
  }

  const bookings = await bookingService.getBookingsByDateRange(startDate, endDate);

  res.status(200).json({
    success: true,
    data: bookings
  });
});

// @desc    Get barber schedule
// @route   GET /api/bookings/barber/:barberId/schedule
// @access  Private
const getBarberSchedule = asyncHandler(async (req, res) => {
  const { barberId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: 'Date is required'
    });
  }

  const schedule = await bookingService.getBarberSchedule(barberId, date);

  res.status(200).json({
    success: true,
    data: schedule
  });
});

// @desc    Get available time slots
// @route   GET /api/bookings/available-slots
// @access  Public
const getAvailableTimeSlots = asyncHandler(async (req, res) => {
  const { barberId, date } = req.query;

  if (!barberId || !date) {
    return res.status(400).json({
      success: false,
      message: 'Barber ID and date are required'
    });
  }

  const slots = await bookingService.getAvailableTimeSlots(barberId, date);

  res.status(200).json({
    success: true,
    data: slots
  });
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin)
const getBookingStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Start date and end date are required'
    });
  }

  const stats = await bookingService.getBookingStats(startDate, endDate);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Search bookings
// @route   GET /api/bookings/search
// @access  Private
const searchBookings = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const result = await bookingService.searchBookings(q);

  res.status(200).json({
    success: true,
    data: result.rows
  });
});

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  confirmBooking,
  completeBooking,
  deleteBooking,
  getBookingsByDateRange,
  getBarberSchedule,
  getAvailableTimeSlots,
  getBookingStats,
  searchBookings
};