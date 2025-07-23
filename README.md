# PropertyPro - Advanced Property Management SaaS

PropertyPro is a comprehensive, multi-tenant Software-as-a-Service (SaaS) platform designed for modern property management companies, real estate agencies, and individual property owners. Built with React, TypeScript, Node.js, Express, and PostgreSQL, it offers enterprise-level features with a scalable architecture.

## 🌟 Key Features

### 🏢 Multi-Tenant Architecture
- **Organization Management**: Support for multiple organizations with isolated data
- **Role-Based Access Control**: Super Admin, Organization Admin, Property Manager, and Tenant roles
- **Subscription Management**: Flexible billing and feature control
- **Data Isolation**: Complete data separation between organizations

### 🏠 Property Management
- **Comprehensive Property Profiles**: Detailed property information with images, amenities, and features
- **Unit Management**: Individual unit tracking with status, features, and tenant assignments
- **Property Analytics**: Occupancy rates, revenue tracking, and performance metrics
- **Multi-Property Portfolio**: Manage unlimited properties across different locations

### 👥 Tenant Management
- **Complete Tenant Profiles**: Personal information, employment details, and emergency contacts
- **Lease Management**: Digital lease creation, renewals, and terminations
- **Tenant Portal**: Self-service portal for rent payments and maintenance requests
- **Communication Tools**: Built-in messaging and notification system

### 💰 Financial Management
- **Automated Rent Collection**: Recurring payment generation and tracking
- **Payment Processing**: Multiple payment methods and transaction tracking
- **Financial Reporting**: Revenue analysis, expense tracking, and profit/loss statements
- **Late Fee Management**: Automatic late fee calculation and application
- **Owner Statements**: Detailed financial reports for property owners

### �� Maintenance Management
- **Work Order System**: Create, assign, and track maintenance requests
- **Priority Management**: Urgent, high, medium, and low priority classification
- **Vendor Management**: Maintain vendor database with service categories
- **Cost Tracking**: Estimate and actual cost management
- **Photo Documentation**: Image attachments for requests and completion

### 📊 Advanced Analytics & Reporting
- **Real-Time Dashboard**: Key performance indicators and metrics
- **Occupancy Analytics**: Vacancy rates, turnover analysis, and trends
- **Revenue Analytics**: Monthly revenue tracking and forecasting
- **Maintenance Analytics**: Request trends, cost analysis, and vendor performance
- **Custom Reports**: Flexible reporting with export capabilities

### 🔐 Security & Compliance
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Permissions**: Granular access control
- **Data Encryption**: Secure data transmission and storage
- **Audit Logging**: Complete activity tracking and compliance reporting
- **GDPR Compliance**: Data privacy and protection features

### 📱 Modern User Experience
- **Responsive Design**: Mobile-first approach for all devices
- **Intuitive Interface**: Clean, modern UI with Material Design
- **Dark/Light Themes**: User preference-based theming
- **Real-Time Updates**: Live notifications and data synchronization
- **Progressive Web App**: Offline capabilities and app-like experience

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API communication
- **Recharts** for data visualization
- **React Hook Form** for form handling

### Backend Stack
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limiting** for API protection
- **Helmet** for security headers
- **Morgan** for request logging

### Database Schema
- **Multi-tenant design** with organization isolation
- **Comprehensive relationships** between entities
- **Optimized indexes** for performance
- **Data integrity constraints**
- **Audit trail capabilities**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/propertypro.git
cd propertypro
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Set up environment variables**

Backend (.env):
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/propertypro"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Optional: File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Optional: Payment Processing (Stripe)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

Frontend (.env):
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=PropertyPro
VITE_APP_VERSION=1.0.0
```

5. **Set up the database**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

6. **Start the development servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in a new terminal):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api

## 👤 Demo Accounts

The system comes with pre-configured demo accounts for testing:

### Super Admin
- **Email**: superadmin@propertypro.com
- **Password**: admin123
- **Access**: Full platform management

### Organization Admin
- **Email**: admin@sunset-pm.com
- **Password**: admin123
- **Access**: Organization management

### Property Manager
- **Email**: manager@sunset-pm.com
- **Password**: manager123
- **Access**: Property and tenant management

### Tenant
- **Email**: tenant@example.com
- **Password**: tenant123
- **Access**: Tenant portal

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Organization Management
- `GET /api/organizations` - List organizations (Super Admin)
- `POST /api/organizations` - Create organization
- `GET /api/organizations/:id` - Get organization details
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Property Management
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/:id/analytics` - Property analytics

### Tenant Management
- `GET /api/tenants` - List tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/:id` - Get tenant details
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant
- `GET /api/tenants/:id/payments` - Tenant payment history
- `GET /api/tenants/:id/maintenance` - Tenant maintenance requests

### Lease Management
- `GET /api/leases` - List leases
- `POST /api/leases` - Create lease
- `GET /api/leases/:id` - Get lease details
- `PUT /api/leases/:id` - Update lease
- `POST /api/leases/:id/terminate` - Terminate lease
- `POST /api/leases/:id/renew` - Renew lease

### Payment Management
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment/invoice
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id` - Update payment
- `POST /api/payments/:id/mark-paid` - Mark payment as paid
- `POST /api/payments/generate-recurring` - Generate recurring payments
- `GET /api/payments/analytics/summary` - Payment analytics

### Maintenance Management
- `GET /api/maintenance` - List maintenance requests
- `POST /api/maintenance` - Create maintenance request
- `GET /api/maintenance/:id` - Get maintenance details
- `PUT /api/maintenance/:id` - Update maintenance request
- `POST /api/maintenance/:id/assign` - Assign maintenance request
- `POST /api/maintenance/:id/comments` - Add comment
- `GET /api/maintenance/analytics/summary` - Maintenance analytics

### Dashboard & Analytics
- `GET /api/dashboard/stats` - Organization dashboard stats
- `GET /api/dashboard/super-admin/stats` - Super admin dashboard stats
- `GET /api/dashboard/revenue/monthly` - Monthly revenue data

## 🔧 Development

### Project Structure
```
propertypro/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── prisma/         # Database schema and migrations
│   │   └── server.ts       # Server entry point
│   └── package.json
├── src/                    # Frontend React application
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React context providers
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application component
├── public/                # Static assets
└── package.json
```

### Development Commands

Frontend:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

Backend:
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name your-migration-name

# Reset database (development only)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   - Set up PostgreSQL database
   - Configure environment variables
   - Set up SSL certificates

2. **Backend Deployment**
```bash
cd backend
npm run build
npm run start
```

3. **Frontend Deployment**
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@propertypro.com
- Documentation: [docs.propertypro.com](https://docs.propertypro.com)

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced reporting with custom report builder
- [ ] Integration with accounting software (QuickBooks, Xero)
- [ ] Electronic signature integration
- [ ] Advanced workflow automation
- [ ] Multi-language support
- [ ] Bulk import/export functionality
- [ ] Advanced tenant screening
- [ ] Property marketing tools
- [ ] IoT device integration

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Advanced analytics and reporting
- **v1.2.0** - Mobile responsiveness improvements
- **v1.3.0** - Multi-tenant architecture
- **v2.0.0** - Complete backend integration (Current)

---

Built with ❤️ by the PropertyPro team
