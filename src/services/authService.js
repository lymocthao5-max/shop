const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');

class AuthService {
  async register(userData) {
    const { name, email, password, phone, role = 'customer' } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    if (phone) {
      const existingPhone = await userRepository.findByPhone(phone);
      if (existingPhone) {
        throw new Error('User with this phone number already exists');
      }
    }

    // Create user
    const user = await userRepository.create({
      name,
      email,
      password,
      phone,
      role
    });

    // Generate token
    const token = generateToken(user.id);

    return {
      user,
      token
    };
  }

  async login(email, password) {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await userRepository.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id);

    return {
      user,
      token
    };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const { password, ...otherData } = updateData;

    // If password is being updated, it will be hashed by the model hook
    const dataToUpdate = password ? updateData : otherData;

    const user = await userRepository.update(userId, dataToUpdate);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    const updatedUser = await userRepository.update(userId, { password: newPassword });
    return updatedUser;
  }
}

module.exports = new AuthService();