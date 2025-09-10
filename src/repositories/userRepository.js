const { User } = require('../models');
const { Op } = require('sequelize');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({
      where: { email }
    });
  }

  async findByPhone(phone) {
    return await User.findOne({
      where: { phone }
    });
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search
    } = options;

    const where = {};
    
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    return await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });
  }

  async update(id, updateData) {
    const [updatedRowsCount] = await User.update(updateData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    return await User.destroy({
      where: { id }
    });
  }

  async updateLastLogin(id) {
    return await User.update(
      { lastLogin: new Date() },
      { where: { id } }
    );
  }
}

module.exports = new UserRepository();