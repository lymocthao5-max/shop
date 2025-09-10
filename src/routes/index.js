const express = require('express');
const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const barberRoutes = require('./barberRoutes');
const bookingRoutes = require('./bookingRoutes');

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/barbers', barberRoutes);
router.use('/bookings', bookingRoutes);

// API Documentation endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopBarber API v1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password',
        logout: 'POST /api/auth/logout'
      },
      services: {
        getAll: 'GET /api/services',
        getActive: 'GET /api/services/active',
        getPopular: 'GET /api/services/popular',
        getCategories: 'GET /api/services/categories',
        getByCategory: 'GET /api/services/category/:category',
        getById: 'GET /api/services/:id',
        create: 'POST /api/services',
        update: 'PUT /api/services/:id',
        delete: 'DELETE /api/services/:id'
      },
      barbers: {
        getAll: 'GET /api/barbers',
        getActive: 'GET /api/barbers/active',
        getAvailable: 'GET /api/barbers/available',
        getById: 'GET /api/barbers/:id',
        create: 'POST /api/barbers',
        update: 'PUT /api/barbers/:id',
        delete: 'DELETE /api/barbers/:id',
        rate: 'POST /api/barbers/:id/rating'
      },
      bookings: {
        getAll: 'GET /api/bookings',
        getById: 'GET /api/bookings/:id',
        create: 'POST /api/bookings',
        update: 'PUT /api/bookings/:id',
        cancel: 'PATCH /api/bookings/:id/cancel',
        confirm: 'PATCH /api/bookings/:id/confirm',
        complete: 'PATCH /api/bookings/:id/complete',
        delete: 'DELETE /api/bookings/:id',
        getAvailableSlots: 'GET /api/bookings/available-slots',
        getBarberSchedule: 'GET /api/bookings/barber/:barberId/schedule',
        search: 'GET /api/bookings/search',
        stats: 'GET /api/bookings/stats'
      }
    },
    documentation: 'https://api-docs.shopbarber.com'
  });
});

module.exports = router;