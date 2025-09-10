module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 15,
        max: 300,
      },
      comment: 'Duration in minutes',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'General',
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]',
      comment: 'JSON string of service features',
      get() {
        const rawValue = this.getDataValue('features');
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (error) {
          return [];
        }
      },
      set(value) {
        this.setDataValue('features', JSON.stringify(value || []));
      }
    },
    popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'CSS color class for UI',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'For ordering services in UI',
    },
  }, {
    tableName: 'Services',
    timestamps: true,
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['popular'],
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['sortOrder'],
      },
    ],
  });

  // Associations
  Service.associate = (models) => {
    Service.hasMany(models.Booking, {
      foreignKey: 'serviceId',
      as: 'bookings',
    });
  };

  return Service;
};