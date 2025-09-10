const { User, Service, Barber, Booking, Customer } = require('../models');
const bcrypt = require('bcryptjs');

const createSampleData = async () => {
  try {
    console.log('🌱 Creating sample data...');

    // Create sample services
    const services = await Service.bulkCreate([
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
    ]);

    // Create sample barbers
    const barbers = await Barber.bulkCreate([
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
    ]);

    // Create sample admin user
    const adminUser = await User.create({
      name: 'Admin ShopBarber',
      email: 'admin@shopbarber.com',
      password: 'admin123456',
      phone: '0900000000',
      role: 'admin'
    });

    // Create sample customer user
    const customerUser = await User.create({
      name: 'Khách hàng mẫu',
      email: 'customer@example.com',
      password: 'customer123',
      phone: '0911111111',
      role: 'customer'
    });

    // Create sample customers - create one by one to avoid unique constraint issues
    const customer1 = await Customer.create({
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'nguyenvana@example.com',
      totalVisits: 5,
      totalSpent: 750000,
      membershipLevel: 'silver',
      loyaltyPoints: 75,
      referralCode: 'NGUYEN001'
    });

    const customer2 = await Customer.create({
      name: 'Trần Văn B',
      phone: '0987654321',
      email: 'tranvanb@example.com',
      totalVisits: 12,
      totalSpent: 1800000,
      membershipLevel: 'gold',
      loyaltyPoints: 180,
      referralCode: 'TRAN002'
    });

    // Create sample bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const booking1 = await Booking.create({
      customerName: 'Nguyễn Văn A',
      customerPhone: '0912345678',
      customerEmail: 'nguyenvana@example.com',
      service: 'Cắt tóc nam cơ bản',
      barber: 'Nguyễn Văn Anh',
      bookingDate: tomorrow.toISOString().split('T')[0],
      bookingTime: '09:00:00',
      status: 'confirmed',
      price: 150000,
      duration: 30,
      userId: customerUser.id,
      serviceId: services[0].id,
      barberId: barbers[0].id
    });

    const booking2 = await Booking.create({
      customerName: 'Trần Văn B',
      customerPhone: '0987654321',
      customerEmail: 'tranvanb@example.com',
      service: 'Cắt tóc VIP',
      barber: 'Trần Minh Tuấn',
      bookingDate: tomorrow.toISOString().split('T')[0],
      bookingTime: '10:30:00',
      status: 'pending',
      price: 300000,
      duration: 60,
      serviceId: services[1].id,
      barberId: barbers[1].id
    });

    console.log('✅ Sample data created successfully!');
    console.log(`📊 Created: ${services.length} services, ${barbers.length} barbers, 2 customers, 2 bookings`);
    console.log('👤 Admin login: admin@shopbarber.com / admin123456');
    console.log('👤 Customer login: customer@example.com / customer123');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
};

module.exports = createSampleData;