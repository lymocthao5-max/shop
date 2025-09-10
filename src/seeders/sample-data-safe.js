const { User, Service, Barber, Booking, Customer } = require('../models');
const bcrypt = require('bcryptjs');

const createSampleData = async () => {
  try {
    console.log('🌱 Creating sample data safely...');

    // Check if admin user already exists
    let adminUser = await User.findOne({ where: { email: 'admin@shopbarber.com' } });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin ShopBarber',
        email: 'admin@shopbarber.com',
        password: 'admin123456',
        phone: '0900000000',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Check if customer user already exists
    let customerUser = await User.findOne({ where: { email: 'customer@example.com' } });
    if (!customerUser) {
      customerUser = await User.create({
        name: 'Khách hàng mẫu',
        email: 'customer@example.com',
        password: 'customer123',
        phone: '0911111111',
        role: 'customer'
      });
      console.log('✅ Customer user created');
    } else {
      console.log('ℹ️ Customer user already exists');
    }

    // Check if services already exist
    const existingServices = await Service.count();
    if (existingServices < 5) {
      // Create missing services
      const servicesToCreate = [
        {
          name: 'Cắt tóc nam cơ bản',
          description: 'Dịch vụ cắt tóc nam cơ bản với phong cách hiện đại',
          price: 150000,
          duration: 30,
          category: 'Cắt tóc',
          features: ['Gội đầu', 'Cắt tóc', 'Tạo kiểu'],
          popular: true,
          color: 'blue'
        },
        {
          name: 'Cắt tóc VIP',
          description: 'Dịch vụ cắt tóc cao cấp với stylist chuyên nghiệp',
          price: 300000,
          duration: 60,
          category: 'Cắt tóc',
          features: ['Gội đầu', 'Cắt tóc', 'Tạo kiểu', 'Massage đầu', 'Đắp mặt nạ'],
          popular: true,
          color: 'gold'
        },
        {
          name: 'Gội + Massage',
          description: 'Dịch vụ gội đầu thư giãn kết hợp massage',
          price: 100000,
          duration: 45,
          category: 'Chăm sóc',
          features: ['Gội đầu', 'Massage đầu', 'Massage vai gáy'],
          popular: false,
          color: 'green'
        },
        {
          name: 'Nhuộm tóc',
          description: 'Dịch vụ nhuộm tóc với màu sắc thời trang',
          price: 500000,
          duration: 120,
          category: 'Nhuộm',
          features: ['Tư vấn màu', 'Nhuộm tóc', 'Chăm sóc sau nhuộm'],
          popular: false,
          color: 'purple'
        },
        {
          name: 'Uốn tóc',
          description: 'Dịch vụ uốn tóc tạo kiểu theo yêu cầu',
          price: 400000,
          duration: 90,
          category: 'Uốn',
          features: ['Tư vấn kiểu tóc', 'Uốn tóc', 'Tạo kiểu'],
          popular: false,
          color: 'orange'
        }
      ];

      for (const serviceData of servicesToCreate) {
        const existingService = await Service.findOne({ where: { name: serviceData.name } });
        if (!existingService) {
          await Service.create(serviceData);
          console.log(`✅ Service "${serviceData.name}" created`);
        }
      }
    } else {
      console.log('ℹ️ Services already exist');
    }

    // Check if barbers already exist
    const existingBarbers = await Barber.count();
    if (existingBarbers < 3) {
      const barbersToCreate = [
        {
          name: 'Nguyễn Văn Anh',
          nickname: 'Anh Barber',
          specialty: 'Cắt tóc nam, tạo kiểu hiện đại',
          specialties: ['Cắt tóc nam', 'Fade cut', 'Undercut'],
          experience: '5 năm kinh nghiệm',
          rating: 4.8,
          bio: 'Chuyên gia cắt tóc nam với nhiều năm kinh nghiệm trong ngành',
          phoneNumber: '0901234567',
          email: 'anh.barber@shopbarber.com'
        },
        {
          name: 'Trần Minh Tuấn',
          nickname: 'Tuấn Pro',
          specialty: 'Nhuộm tóc, tạo kiểu sáng tạo',
          specialties: ['Nhuộm tóc', 'Highlight', 'Balayage'],
          experience: '7 năm kinh nghiệm',
          rating: 4.9,
          bio: 'Chuyên gia nhuộm tóc và tạo kiểu với phong cách sáng tạo',
          phoneNumber: '0907654321',
          email: 'tuan.pro@shopbarber.com'
        },
        {
          name: 'Lê Hoàng Nam',
          nickname: 'Nam Stylist',
          specialty: 'Uốn tóc, tạo kiểu cổ điển',
          specialties: ['Uốn tóc', 'Perm', 'Tạo kiểu cổ điển'],
          experience: '4 năm kinh nghiệm',
          rating: 4.7,
          bio: 'Chuyên gia uốn tóc và tạo kiểu với phong cách cổ điển',
          phoneNumber: '0903456789',
          email: 'nam.stylist@shopbarber.com'
        }
      ];

      for (const barberData of barbersToCreate) {
        const existingBarber = await Barber.findOne({ where: { email: barberData.email } });
        if (!existingBarber) {
          await Barber.create(barberData);
          console.log(`✅ Barber "${barberData.name}" created`);
        }
      }
    } else {
      console.log('ℹ️ Barbers already exist');
    }

    // Check if customers already exist
    const existingCustomers = await Customer.count();
    if (existingCustomers < 2) {
      const customersToCreate = [
        {
          name: 'Nguyễn Văn A',
          phone: '0912345678',
          email: 'nguyenvana@example.com',
          totalVisits: 5,
          totalSpent: 750000,
          membershipLevel: 'silver',
          loyaltyPoints: 75,
          referralCode: 'NGUYEN001'
        },
        {
          name: 'Trần Văn B',
          phone: '0987654321',
          email: 'tranvanb@example.com',
          totalVisits: 12,
          totalSpent: 1800000,
          membershipLevel: 'gold',
          loyaltyPoints: 180,
          referralCode: 'TRAN002'
        }
      ];

      for (const customerData of customersToCreate) {
        const existingCustomer = await Customer.findOne({ where: { phone: customerData.phone } });
        if (!existingCustomer) {
          await Customer.create(customerData);
          console.log(`✅ Customer "${customerData.name}" created`);
        }
      }
    } else {
      console.log('ℹ️ Customers already exist');
    }

    console.log('✅ Sample data creation completed successfully!');
    console.log('👤 Admin login: admin@shopbarber.com / admin123456');
    console.log('👤 Customer login: customer@example.com / customer123');

  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
};

module.exports = createSampleData;