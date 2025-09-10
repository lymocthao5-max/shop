const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;