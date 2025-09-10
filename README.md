# ShopBarber Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- SQL Server (2012 or later)

### Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd shopbarber-backend
npm install
```

2. **Environment Configuration:**
Create `.env` file (already configured for development):
```env
NODE_ENV=development
PORT=5000
DB_HOST=202.55.135.42
DB_PORT=1433
DB_NAME=ShopBarber
DB_USER=sa
DB_PASSWORD=123456789
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
JWT_EXPIRE=7d
```

3. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

4. **Create sample data (optional):**
```bash
npm run seed
```

## ✅ Health Check
- **Server**: http://localhost:5000/api/health
- **API Documentation**: http://localhost:5000/api/

## 🔑 Test Accounts
- **Admin**: admin@shopbarber.com / admin123456
- **Customer**: customer@example.com / customer123

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Services
- `GET /api/services` - Get all services
- `GET /api/services/active` - Get active services
- `GET /api/services/popular` - Get popular services
- `GET /api/services/categories` - Get service categories
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Barbers
- `GET /api/barbers` - Get all barbers
- `GET /api/barbers/active` - Get active barbers
- `GET /api/barbers/available` - Get available barbers
- `POST /api/barbers` - Create barber (Admin)
- `PUT /api/barbers/:id` - Update barber (Admin)
- `DELETE /api/barbers/:id` - Delete barber (Admin)

### Bookings
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `PATCH /api/bookings/:id/confirm` - Confirm booking (Admin)
- `PATCH /api/bookings/:id/complete` - Complete booking (Admin)
- `GET /api/bookings/available-slots` - Get available time slots
- `GET /api/bookings/barber/:barberId/schedule` - Get barber schedule

## 🛠️ Development

### Scripts
```bash
npm run dev      # Start development server
npm start        # Start production server
npm run seed     # Create sample data
npm test         # Run tests
```

### Database Models
- **Users** - Authentication and user management
- **Services** - Barbershop services
- **Barbers** - Barber profiles and schedules
- **Bookings** - Appointment bookings
- **Customers** - Customer management and loyalty

### Features
- ✅ JWT Authentication
- ✅ Role-based access control (Admin, Customer)
- ✅ Service management
- ✅ Barber scheduling
- ✅ Booking system with time slot validation
- ✅ Customer loyalty program
- ✅ RESTful API design
- ✅ Input validation
- ✅ Error handling
- ✅ SQL Server integration

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check SQL Server is running
   - Verify connection credentials in `.env`
   - Ensure database `ShopBarber` exists

2. **Port Already in Use**
   ```bash
   pkill -f "node server.js"
   npm run dev
   ```

3. **Sample Data Creation Error**
   - Run `npm run seed` to create sample data safely
   - Check for existing data before creating new records

### SQL Server 2012 Compatibility
- Uses Sequelize 6.32.1 for compatibility
- Deprecation warnings are normal and don't affect functionality
- All features tested and working on SQL Server 2012

## 📈 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update database credentials for production
3. Use process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name shopbarber-api
```

## 🤝 Support
For issues or questions, please check the API documentation at `/api/` endpoint when server is running.