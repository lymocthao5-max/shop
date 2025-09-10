module.exports = (sequelize, DataTypes) => {
  const Barber = sequelize.define('Barber', {
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
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    specialty: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    specialties: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]',
      comment: 'JSON string of specialties',
      get() {
        const rawValue = this.getDataValue('specialties');
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (error) {
          return [];
        }
      },
      set(value) {
        this.setDataValue('specialties', JSON.stringify(value || []));
      }
    },
    experience: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 5.0,
      validate: {
        min: 1.0,
        max: 5.0,
      },
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    workingHours: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: JSON.stringify({
        monday: { start: '09:00', end: '21:00', isWorking: true },
        tuesday: { start: '09:00', end: '21:00', isWorking: true },
        wednesday: { start: '09:00', end: '21:00', isWorking: true },
        thursday: { start: '09:00', end: '21:00', isWorking: true },
        friday: { start: '09:00', end: '21:00', isWorking: true },
        saturday: { start: '09:00', end: '21:00', isWorking: true },
        sunday: { start: '10:00', end: '20:00', isWorking: true },
      }),
      comment: 'JSON string of working hours for each day',
      get() {
        const rawValue = this.getDataValue('workingHours');
        try {
          return rawValue ? JSON.parse(rawValue) : {
            monday: { start: '09:00', end: '21:00', isWorking: true },
            tuesday: { start: '09:00', end: '21:00', isWorking: true },
            wednesday: { start: '09:00', end: '21:00', isWorking: true },
            thursday: { start: '09:00', end: '21:00', isWorking: true },
            friday: { start: '09:00', end: '21:00', isWorking: true },
            saturday: { start: '09:00', end: '21:00', isWorking: true },
            sunday: { start: '10:00', end: '20:00', isWorking: true },
          };
        } catch (error) {
          return {
            monday: { start: '09:00', end: '21:00', isWorking: true },
            tuesday: { start: '09:00', end: '21:00', isWorking: true },
            wednesday: { start: '09:00', end: '21:00', isWorking: true },
            thursday: { start: '09:00', end: '21:00', isWorking: true },
            friday: { start: '09:00', end: '21:00', isWorking: true },
            saturday: { start: '09:00', end: '21:00', isWorking: true },
            sunday: { start: '10:00', end: '20:00', isWorking: true },
          };
        }
      },
      set(value) {
        this.setDataValue('workingHours', JSON.stringify(value || {}));
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9+\-\s()]+$/,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    joinDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    totalBookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    averageRating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 5.0,
    },
  }, {
    tableName: 'Barbers',
    timestamps: true,
    indexes: [
      {
        fields: ['isAvailable'],
      },
      {
        fields: ['rating'],
      },
      {
        fields: ['specialty'],
      },
    ],
  });

  // Associations
  Barber.associate = (models) => {
    Barber.hasMany(models.Booking, {
      foreignKey: 'barberId',
      as: 'bookings',
    });
  };

  return Barber;
};