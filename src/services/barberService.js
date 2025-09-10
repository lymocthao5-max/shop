const barberRepository = require('../repositories/barberRepository');

class BarberService {
  async createBarber(barberData) {
    return await barberRepository.create(barberData);
  }

  async getAllBarbers(options = {}) {
    return await barberRepository.findAll(options);
  }

  async getActiveBarbers() {
    return await barberRepository.findActive();
  }

  async getBarberById(id) {
    const barber = await barberRepository.findById(id);
    if (!barber) {
      throw new Error('Barber not found');
    }
    return barber;
  }

  async updateBarber(id, updateData) {
    const barber = await barberRepository.update(id, updateData);
    if (!barber) {
      throw new Error('Barber not found');
    }
    return barber;
  }

  async deleteBarber(id) {
    const deleted = await barberRepository.delete(id);
    if (!deleted) {
      throw new Error('Barber not found');
    }
    return { message: 'Barber deleted successfully' };
  }

  async getAvailableBarbers(date, time) {
    return await barberRepository.findAvailable(date, time);
  }

  async toggleBarberStatus(id) {
    const barber = await barberRepository.findById(id);
    if (!barber) {
      throw new Error('Barber not found');
    }

    const updatedBarber = await barberRepository.update(id, {
      isAvailable: !barber.isAvailable
    });

    return updatedBarber;
  }

  async updateWorkingHours(id, workingHours) {
    const barber = await barberRepository.update(id, { workingHours });
    if (!barber) {
      throw new Error('Barber not found');
    }
    return barber;
  }

  async updateRating(id, newRating) {
    const barber = await barberRepository.findById(id);
    if (!barber) {
      throw new Error('Barber not found');
    }

    // Calculate new average rating
    const totalBookings = barber.totalBookings || 0;
    const currentAverage = barber.averageRating || 5.0;
    const newAverage = ((currentAverage * totalBookings) + newRating) / (totalBookings + 1);

    const updatedBarber = await barberRepository.update(id, {
      averageRating: parseFloat(newAverage.toFixed(1)),
      totalBookings: totalBookings + 1
    });

    return updatedBarber;
  }
}

module.exports = new BarberService();