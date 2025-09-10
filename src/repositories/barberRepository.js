const { Barber } = require('../models');
const { Op } = require('sequelize');

class BarberRepository {
  async create(barberData) {
    return await Barber.create(barberData);
  }

  async findById(id) {
    return await Barber.findByPk(id);
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      isActive,
      search
    } = options;

    const where = {};
    
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { specialties: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    return await Barber.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['name', 'ASC']]
    });
  }

  async findActive() {
    return await Barber.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
  }

  async findAvailable(date, time) {
    // This would need to check against bookings
    return await Barber.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
  }

  async update(id, updateData) {
    const [updatedRowsCount] = await Barber.update(updateData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    return await Barber.destroy({
      where: { id }
    });
  }
}

module.exports = new BarberRepository();