module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
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
    totalVisits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    totalSpent: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true,
      },
    },
    lastVisit: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]',
      comment: 'JSON string of customer preferences',
      get() {
        const rawValue = this.getDataValue('preferences');
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (error) {
          return [];
        }
      },
      set(value) {
        this.setDataValue('preferences', JSON.stringify(value || []));
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Staff notes about customer',
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    membershipLevel: {
      type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
      defaultValue: 'bronze',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    referralCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    referredBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // Social media and marketing preferences
    allowSMS: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowPromotions: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'Customers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['phone'],
        name: 'customers_phone_unique'
      },
      {
        fields: ['email'],
        name: 'customers_email_index'
      },
      {
        unique: true,
        fields: ['referralCode'],
        name: 'customers_referral_code_unique',
        where: {
          referralCode: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        fields: ['membershipLevel'],
        name: 'customers_membership_level_index'
      },
      {
        fields: ['isActive'],
        name: 'customers_is_active_index'
      },
      {
        fields: ['totalSpent'],
        name: 'customers_total_spent_index'
      },
      {
        fields: ['lastVisit'],
        name: 'customers_last_visit_index'
      },
    ],
  });

  // Instance methods
  Customer.prototype.updateMembershipLevel = function() {
    if (this.totalSpent >= 10000000) { // 10M VND
      this.membershipLevel = 'platinum';
    } else if (this.totalSpent >= 5000000) { // 5M VND
      this.membershipLevel = 'gold';
    } else if (this.totalSpent >= 2000000) { // 2M VND
      this.membershipLevel = 'silver';
    } else {
      this.membershipLevel = 'bronze';
    }
  };

  Customer.prototype.addLoyaltyPoints = function(amount) {
    // 1 point per 10,000 VND spent
    const points = Math.floor(amount / 10000);
    this.loyaltyPoints += points;
    return points;
  };

  // Associations - Remove self-referential foreign key for SQL Server 2012 compatibility
  Customer.associate = (models) => {
    // Note: Self-referential associations removed for SQL Server 2012 compatibility
    // Can be handled at application level if needed
  };

  return Customer;
};