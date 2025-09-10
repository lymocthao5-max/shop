const { body, param, query } = require('express-validator');

// Auth validation
const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['customer', 'barber', 'admin'])
    .withMessage('Role must be customer, barber, or admin')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Service validation
const serviceValidation = [
  body('name')
    .notEmpty()
    .withMessage('Service name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Service name must be between 2 and 200 characters'),
  body('description')
    .notEmpty()
    .withMessage('Service description is required'),
  body('price')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Price must be a valid decimal number')
    .custom(value => {
      if (parseFloat(value) < 0) {
        throw new Error('Price must be greater than or equal to 0');
      }
      return true;
    }),
  body('duration')
    .isInt({ min: 15, max: 300 })
    .withMessage('Duration must be between 15 and 300 minutes'),
  body('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category must not exceed 100 characters'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('popular')
    .optional()
    .isBoolean()
    .withMessage('Popular must be a boolean value'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Barber validation
const barberValidation = [
  body('name')
    .notEmpty()
    .withMessage('Barber name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Barber name must be between 2 and 100 characters'),
  body('specialty')
    .notEmpty()
    .withMessage('Specialty is required')
    .isLength({ max: 200 })
    .withMessage('Specialty must not exceed 200 characters'),
  body('experience')
    .notEmpty()
    .withMessage('Experience is required')
    .isLength({ max: 100 })
    .withMessage('Experience must not exceed 100 characters'),
  body('rating')
    .optional()
    .isDecimal({ decimal_digits: '0,1' })
    .withMessage('Rating must be a decimal number')
    .custom(value => {
      const rating = parseFloat(value);
      if (rating < 1.0 || rating > 5.0) {
        throw new Error('Rating must be between 1.0 and 5.0');
      }
      return true;
    }),
  body('phoneNumber')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value')
];

// Booking validation
const bookingValidation = [
  body('customerName')
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  body('customerPhone')
    .notEmpty()
    .withMessage('Customer phone is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('customerEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('service')
    .notEmpty()
    .withMessage('Service is required'),
  body('barber')
    .notEmpty()
    .withMessage('Barber is required'),
  body('bookingDate')
    .notEmpty()
    .withMessage('Booking date is required')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom(value => {
      const bookingDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        throw new Error('Booking date cannot be in the past');
      }
      return true;
    }),
  body('bookingTime')
    .notEmpty()
    .withMessage('Booking time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Please provide a valid time format (HH:MM:SS)'),
  body('serviceId')
    .optional()
    .isUUID()
    .withMessage('Service ID must be a valid UUID'),
  body('barberId')
    .optional()
    .isUUID()
    .withMessage('Barber ID must be a valid UUID')
];

// Parameter validation
const uuidValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format')
];

// Query validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

module.exports = {
  registerValidation,
  loginValidation,
  serviceValidation,
  barberValidation,
  bookingValidation,
  uuidValidation,
  paginationValidation
};