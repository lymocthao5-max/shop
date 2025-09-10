const { Booking, User, Service, Barber } = require('../models');
const { Op } = require('sequelize');

class BookingRepository {
  async create(bookingData) {
    return await Booking.create(bookingData);
  }

  async findById(id) {
    return await Booking.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: Service, as: 'serviceDetails' },
        { model: Barber, as: 'barberDetails' }
      ]
    });
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      barberId,
      serviceId,
      userId,
      date,
      search
    } = options;

    const where = {};
    
    if (status) where.status = status;
    if (barberId) where.barberId = barberId;
    if (serviceId) where.serviceId = serviceId;
    if (userId) where.userId = userId;
    if (date) where.bookingDate = date;
    if (search) {
      where[Op.or] = [
        { customerName: { [Op.like]: `%${search}%` } },
        { customerPhone: { [Op.like]: `%${search}%` } },
        { customerEmail: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    return await Booking.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: Service, as: 'serviceDetails' },
        { model: Barber, as: 'barberDetails' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['bookingDate', 'DESC'], ['bookingTime', 'DESC']]
    });
  }

  async findByDateRange(startDate, endDate) {
    return await Booking.findAll({
      where: {
        bookingDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        { model: User, as: 'user' },
        { model: Service, as: 'serviceDetails' },
        { model: Barber, as: 'barberDetails' }
      ],
      order: [['bookingDate', 'ASC'], ['bookingTime', 'ASC']]
    });
  }

  async findByBarberAndDate(barberId, date) {
    return await Booking.findAll({
      where: {
        barberId,
        bookingDate: date,
        status: { [Op.ne]: 'cancelled' }
      },
      order: [['bookingTime', 'ASC']]
    });
  }

  async checkTimeSlotAvailability(barberId, date, time, excludeBookingId = null) {
    const where = {
      barberId,
      bookingDate: date,
      bookingTime: time,
      status: { [Op.ne]: 'cancelled' }
    };

    if (excludeBookingId) {
      where.id = { [Op.ne]: excludeBookingId };
    }

    const existingBooking = await Booking.findOne({ where });
    return !existingBooking;
  }

  async update(id, updateData) {
    const [updatedRowsCount] = await Booking.update(updateData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    return await Booking.destroy({
      where: { id }
    });
  }

  async getBookingStats(startDate, endDate) {
    const bookings = await Booking.findAll({
      where: {
        bookingDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: ['status']
    });

    const stats = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };

    bookings.forEach(booking => {
      stats[booking.status]++;
    });

    return stats;
  }
}

module.exports = new BookingRepository();