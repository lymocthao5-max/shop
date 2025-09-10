import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  StarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import serviceService from '../services/serviceService';
import barberService from '../services/barberService';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Home = () => {
  const [popularServices, setPopularServices] = useState([]);
  const [topBarbers, setTopBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, barbersData] = await Promise.all([
          serviceService.getPopularServices(),
          barberService.getActiveBarbers()
        ]);
        
        setPopularServices(servicesData.slice(0, 3));
        setTopBarbers(barbersData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: CalendarDaysIcon,
      title: 'Đặt lịch dễ dàng',
      description: 'Đặt lịch cắt tóc chỉ với vài cú click, chọn thời gian phù hợp với bạn'
    },
    {
      icon: UserGroupIcon,
      title: 'Thợ cắt tóc chuyên nghiệp',
      description: 'Đội ngũ thợ cắt tóc giàu kinh nghiệm, luôn cập nhật xu hướng mới nhất'
    },
    {
      icon: StarIcon,
      title: 'Dịch vụ chất lượng cao',
      description: 'Cam kết mang đến dịch vụ tốt nhất với giá cả hợp lý'
    },
    {
      icon: ClockIcon,
      title: 'Tiết kiệm thời gian',
      description: 'Không cần chờ đợi, đến đúng giờ hẹn và được phục vụ ngay lập tức'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chào mừng đến với <span className="text-yellow-400">ShopBarber</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Hệ thống đặt lịch cắt tóc hiện đại - Nhanh chóng, tiện lợi, chuyên nghiệp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Đặt lịch ngay
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Xem dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn ShopBarber?
            </h2>
            <p className="text-lg text-gray-600">
              Chúng tôi mang đến trải nghiệm cắt tóc tuyệt vời nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dịch vụ phổ biến
            </h2>
            <p className="text-lg text-gray-600">
              Những dịch vụ được khách hàng yêu thích nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularServices.map((service) => (
              <div key={service.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <span className="text-2xl font-bold text-primary-600">
                    {service.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    {service.duration} phút
                  </span>
                  <Link
                    to="/booking"
                    className="btn-primary text-sm"
                  >
                    Đặt lịch
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="btn-outline"
            >
              Xem tất cả dịch vụ
            </Link>
          </div>
        </div>
      </section>

      {/* Top Barbers Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thợ cắt tóc hàng đầu
            </h2>
            <p className="text-lg text-gray-600">
              Đội ngũ thợ cắt tóc chuyên nghiệp và giàu kinh nghiệm
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topBarbers.map((barber) => (
              <div key={barber.id} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserGroupIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {barber.name}
                </h3>
                <p className="text-gray-600 mb-2">
                  {barber.specialty}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {barber.experience}
                </p>
                <div className="flex items-center justify-center mb-4">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-700">{barber.rating}</span>
                </div>
                <Link
                  to="/booking"
                  className="btn-primary text-sm"
                >
                  Đặt lịch với {barber.nickname || barber.name}
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/barbers"
              className="btn-outline"
            >
              Xem tất cả thợ cắt tóc
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng để có một kiểu tóc mới?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Đặt lịch ngay hôm nay và trải nghiệm dịch vụ tuyệt vời của chúng tôi
          </p>
          <Link
            to="/booking"
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center"
          >
            <CalendarDaysIcon className="h-5 w-5 mr-2" />
            Đặt lịch ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;