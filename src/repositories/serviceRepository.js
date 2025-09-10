const { Service } = require('../models');
const { Op } = require('sequelize');

class ServiceRepository {
  async create(serviceData) {
    return await Service.create(serviceData);
  }

  async findById(id) {
    return await Service.findByPk(id);
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      category,
      isActive,
      popular,
      search
    } = options;

    const where = {};
    
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;
    if (popular !== undefined) where.popular = popular;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    return await Service.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });
  }

  async findActive() {
    return await Service.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
  }

  async findPopular() {
    return await Service.findAll({
      where: { 
        isActive: true,
        popular: true 
      },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
  }

  async findByCategory(category) {
    return await Service.findAll({
      where: { 
        category,
        isActive: true 
      },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
  }

  async update(id, updateData) {
    const [updatedRowsCount] = await Service.update(updateData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    return await Service.destroy({
      where: { id }
    });
  }

  async getCategories() {
    const services = await Service.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category']
    });
    
    return services.map(service => service.category);
  }
}

module.exports = new ServiceRepository();