const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  const user = await authService.changePassword(req.user.id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: user
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};