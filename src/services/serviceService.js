const serviceRepository = require('../repositories/serviceRepository');

class ServiceService {
  async createService(serviceData) {
    return await serviceRepository.create(serviceData);
  }

  async getAllServices(options = {}) {
    return await serviceRepository.findAll(options);
  }

  async getActiveServices() {
    return await serviceRepository.findActive();
  }

  async getPopularServices() {
    return await serviceRepository.findPopular();
  }

  async getServicesByCategory(category) {
    return await serviceRepository.findByCategory(category);
  }

  async getServiceById(id) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  }

  async updateService(id, updateData) {
    const service = await serviceRepository.update(id, updateData);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  }

  async deleteService(id) {
    const deleted = await serviceRepository.delete(id);
    if (!deleted) {
      throw new Error('Service not found');
    }
    return { message: 'Service deleted successfully' };
  }

  async getCategories() {
    return await serviceRepository.getCategories();
  }

  async toggleServiceStatus(id) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new Error('Service not found');
    }

    const updatedService = await serviceRepository.update(id, {
      isActive: !service.isActive
    });

    return updatedService;
  }

  async togglePopularStatus(id) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new Error('Service not found');
    }

    const updatedService = await serviceRepository.update(id, {
      popular: !service.popular
    });

    return updatedService;
  }
}

module.exports = new ServiceService();