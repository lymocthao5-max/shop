module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[0-9+\-\s()]+$/,
      },
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    service: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    barber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
    bookingTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
        isDecimal: true,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 15,
        max: 300,
      },
      comment: 'Duration in minutes',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Internal notes for staff',
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    confirmationSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Foreign keys
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Services',
        key: 'id',
      },
    },
    barberId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Barbers',
        key: 'id',
      },
    },
  }, {
    tableName: 'Bookings',
    timestamps: true,
    indexes: [
      {
        fields: ['bookingDate'],
      },
      {
        fields: ['bookingTime'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['customerPhone'],
      },
      {
        fields: ['barberId'],
      },
      {
        fields: ['serviceId'],
      },
      {
        unique: true,
        fields: ['barberId', 'bookingDate', 'bookingTime'],
        name: 'unique_barber_datetime',
      },
    ],
    validate: {
      // Ensure no double booking for the same barber at the same time
      async uniqueBarberDateTime() {
        if (this.barberId && this.bookingDate && this.bookingTime && this.status !== 'cancelled') {
          const existingBooking = await Booking.findOne({
            where: {
              barberId: this.barberId,
              bookingDate: this.bookingDate,
              bookingTime: this.bookingTime,
              status: {
                [sequelize.Sequelize.Op.ne]: 'cancelled',
              },
              id: {
                [sequelize.Sequelize.Op.ne]: this.id || null,
              },
            },
          });
          
          if (existingBooking) {
            throw new Error('This time slot is already booked for this barber');
          }
        }
      },
    },
  });

  // Associations
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    
    Booking.belongsTo(models.Service, {
      foreignKey: 'serviceId',
      as: 'serviceDetails',
    });
    
    Booking.belongsTo(models.Barber, {
      foreignKey: 'barberId',
      as: 'barberDetails',
    });
  };

  return Booking;
};