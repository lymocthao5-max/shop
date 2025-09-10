const express = require('express');
const {
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
} = require('../controllers/barberController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { barberValidation, uuidValidation, paginationValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', paginationValidation, getBarbers);
router.get('/active', getActiveBarbers);
router.get('/available', getAvailableBarbers);
router.get('/:id', uuidValidation, getBarber);

// Protected routes
router.use(protect);

// Customer can rate barbers
router.post('/:id/rating', uuidValidation, updateRating);

// Admin only routes
router.use(authorize('admin'));
router.post('/', barberValidation, createBarber);
router.put('/:id', uuidValidation, updateBarber);
router.delete('/:id', uuidValidation, deleteBarber);
router.patch('/:id/toggle-status', uuidValidation, toggleBarberStatus);
router.put('/:id/working-hours', uuidValidation, updateWorkingHours);

module.exports = router;