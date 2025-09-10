const bookingRepository = require('../repositories/bookingRepository');
const serviceRepository = require('../repositories/serviceRepository');
const barberRepository = require('../repositories/barberRepository');

class BookingService {
  async createBooking(bookingData) {
    const {
      customerName,
      customerPhone,
      customerEmail,
      service,
      barber,
      bookingDate,
      bookingTime,
      message,
      serviceId,
      barberId
    } = bookingData;

    // Check if time slot is available
    if (barberId) {
      const isAvailable = await bookingRepository.checkTimeSlotAvailability(
        barberId,
        bookingDate,
        bookingTime
      );

      if (!isAvailable) {
        throw new Error('This time slot is already booked');
      }
    }

    // Get service details for pricing
    let serviceDetails = null;
    if (serviceId) {
      serviceDetails = await serviceRepository.findById(serviceId);
    }

    const booking = await bookingRepository.create({
      customerName,
      customerPhone,
      customerEmail,
      service,
      barber,
      bookingDate,
      bookingTime,
      message,
      serviceId,
      barberId,
      price: serviceDetails?.price || null,
      duration: serviceDetails?.duration || null
    });

    return await bookingRepository.findById(booking.id);
  }

  async getAllBookings(options = {}) {
    return await bookingRepository.findAll(options);
  }

  async getBookingById(id) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async updateBooking(id, updateData) {
    const {
      barberId,
      bookingDate,
      bookingTime,
      ...otherData
    } = updateData;

    // If updating time/date/barber, check availability
    if (barberId && bookingDate && bookingTime) {
      const isAvailable = await bookingRepository.checkTimeSlotAvailability(
        barberId,
        bookingDate,
        bookingTime,
        id // exclude current booking from check
      );

      if (!isAvailable) {
        throw new Error('This time slot is already booked');
      }
    }

    const booking = await bookingRepository.update(id, updateData);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async cancelBooking(id) {
    const booking = await bookingRepository.update(id, { status: 'cancelled' });
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async confirmBooking(id) {
    const booking = await bookingRepository.update(id, { 
      status: 'confirmed',
      confirmationSent: true
    });
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async completeBooking(id) {
    const booking = await bookingRepository.update(id, { status: 'completed' });
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async deleteBooking(id) {
    const deleted = await bookingRepository.delete(id);
    if (!deleted) {
      throw new Error('Booking not found');
    }
    return { message: 'Booking deleted successfully' };
  }

  async getBookingsByDateRange(startDate, endDate) {
    return await bookingRepository.findByDateRange(startDate, endDate);
  }

  async getBarberSchedule(barberId, date) {
    return await bookingRepository.findByBarberAndDate(barberId, date);
  }

  async getAvailableTimeSlots(barberId, date) {
    const barber = await barberRepository.findById(barberId);
    if (!barber) {
      throw new Error('Barber not found');
    }

    const bookings = await bookingRepository.findByBarberAndDate(barberId, date);
    const bookedTimes = bookings.map(booking => booking.bookingTime);

    // Generate available time slots (example: 9:00 AM to 9:00 PM, 30-minute intervals)
    const availableSlots = [];
    const startHour = 9;
    const endHour = 21;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
        if (!bookedTimes.includes(timeSlot)) {
          availableSlots.push(timeSlot);
        }
      }
    }

    return availableSlots;
  }

  async getBookingStats(startDate, endDate) {
    return await bookingRepository.getBookingStats(startDate, endDate);
  }

  async searchBookings(query) {
    return await bookingRepository.findAll({
      search: query,
      limit: 50
    });
  }
}

module.exports = new BookingService();