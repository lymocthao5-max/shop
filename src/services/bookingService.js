import api from '../config/api';

class BookingService {
  async getBookings(params = {}) {
    const response = await api.get('/bookings', { params });
    return response.data;
  }

  async getBookingById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
  }

  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data.data;
  }

  async updateBooking(id, bookingData) {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data.data;
  }

  async cancelBooking(id) {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data.data;
  }

  async confirmBooking(id) {
    const response = await api.patch(`/bookings/${id}/confirm`);
    return response.data.data;
  }

  async completeBooking(id) {
    const response = await api.patch(`/bookings/${id}/complete`);
    return response.data.data;
  }

  async deleteBooking(id) {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }

  async getAvailableTimeSlots(barberId, date) {
    const response = await api.get('/bookings/available-slots', {
      params: { barberId, date }
    });
    return response.data.data;
  }

  async getBarberSchedule(barberId, date) {
    const response = await api.get(`/bookings/barber/${barberId}/schedule`, {
      params: { date }
    });
    return response.data.data;
  }

  async getBookingStats(startDate, endDate) {
    const response = await api.get('/bookings/stats', {
      params: { startDate, endDate }
    });
    return response.data.data;
  }

  async searchBookings(query) {
    const response = await api.get('/bookings/search', {
      params: { q: query }
    });
    return response.data.data;
  }
}

export default new BookingService();