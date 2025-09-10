const express = require('express');
const {
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
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { serviceValidation, uuidValidation, paginationValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', paginationValidation, getServices);
router.get('/active', getActiveServices);
router.get('/popular', getPopularServices);
router.get('/categories', getCategories);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', uuidValidation, getService);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', serviceValidation, createService);
router.put('/:id', uuidValidation, updateService);
router.delete('/:id', uuidValidation, deleteService);
router.patch('/:id/toggle-status', uuidValidation, toggleServiceStatus);
router.patch('/:id/toggle-popular', uuidValidation, togglePopularStatus);

module.exports = router;