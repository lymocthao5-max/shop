import api from '../config/api';

class BarberService {
  async getBarbers(params = {}) {
    const response = await api.get('/barbers', { params });
    return response.data;
  }

  async getActiveBarbers() {
    const response = await api.get('/barbers/active');
    return response.data.data;
  }

  async getAvailableBarbers(date, time) {
    const response = await api.get('/barbers/available', {
      params: { date, time }
    });
    return response.data.data;
  }

  async getBarberById(id) {
    const response = await api.get(`/barbers/${id}`);
    return response.data.data;
  }

  async createBarber(barberData) {
    const response = await api.post('/barbers', barberData);
    return response.data.data;
  }

  async updateBarber(id, barberData) {
    const response = await api.put(`/barbers/${id}`, barberData);
    return response.data.data;
  }

  async deleteBarber(id) {
    const response = await api.delete(`/barbers/${id}`);
    return response.data;
  }

  async toggleBarberStatus(id) {
    const response = await api.patch(`/barbers/${id}/toggle-status`);
    return response.data.data;
  }

  async updateWorkingHours(id, workingHours) {
    const response = await api.put(`/barbers/${id}/working-hours`, { workingHours });
    return response.data.data;
  }

  async updateRating(id, rating) {
    const response = await api.post(`/barbers/${id}/rating`, { rating });
    return response.data.data;
  }
}

export default new BarberService();