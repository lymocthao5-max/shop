const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255],
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9+\-\s()]+$/,
      },
    },
    role: {
      type: DataTypes.ENUM('customer', 'barber', 'admin'),
      defaultValue: 'customer',
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'Users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
        name: 'users_email_unique'
      },
      {
        fields: ['phone'],
        name: 'users_phone_index'
      },
      {
        fields: ['role'],
        name: 'users_role_index'
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  // Instance methods
  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  // Associations
  User.associate = (models) => {
    User.hasMany(models.Booking, {
      foreignKey: 'userId',
      as: 'bookings',
    });
  };

  return User;
};