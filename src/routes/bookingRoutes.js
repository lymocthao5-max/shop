const express = require('express');
const {
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
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { bookingValidation, uuidValidation, paginationValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/', bookingValidation, createBooking);
router.get('/available-slots', getAvailableTimeSlots);

// Protected routes
router.use(protect);

router.get('/', paginationValidation, getBookings);
router.get('/search', searchBookings);
router.get('/date-range', getBookingsByDateRange);
router.get('/barber/:barberId/schedule', getBarberSchedule);
router.get('/:id', uuidValidation, getBooking);
router.put('/:id', uuidValidation, updateBooking);
router.patch('/:id/cancel', uuidValidation, cancelBooking);

// Admin and Barber routes
router.patch('/:id/confirm', uuidValidation, authorize('admin', 'barber'), confirmBooking);
router.patch('/:id/complete', uuidValidation, authorize('admin', 'barber'), completeBooking);

// Admin only routes
router.delete('/:id', uuidValidation, authorize('admin'), deleteBooking);
router.get('/stats', authorize('admin'), getBookingStats);

module.exports = router;