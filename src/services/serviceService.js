import api from '../config/api';

class ServiceService {
  async getServices(params = {}) {
    const response = await api.get('/services', { params });
    return response.data;
  }

  async getActiveServices() {
    const response = await api.get('/services/active');
    return response.data.data;
  }

  async getPopularServices() {
    const response = await api.get('/services/popular');
    return response.data.data;
  }

  async getCategories() {
    const response = await api.get('/services/categories');
    return response.data.data;
  }

  async getServiceById(id) {
    const response = await api.get(`/services/${id}`);
    return response.data.data;
  }

  async createService(serviceData) {
    const response = await api.post('/services', serviceData);
    return response.data.data;
  }

  async updateService(id, serviceData) {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data.data;
  }

  async deleteService(id) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }

  async toggleServiceStatus(id) {
    const response = await api.patch(`/services/${id}/toggle-status`);
    return response.data.data;
  }

  async togglePopularStatus(id) {
    const response = await api.patch(`/services/${id}/toggle-popular`);
    return response.data.data;
  }
}

export default new ServiceService();