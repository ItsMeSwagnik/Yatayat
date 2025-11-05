# Yatayat - Smart Traffic Violation Detection System

**"Smart Surveillance. Safer Roads"**

A comprehensive full-stack web application for managing traffic violations, designed for citizens, traffic police, and administrators. Built with React frontend and Node.js/MongoDB backend, deployed on Vercel.

## 🚀 Features

### 🧍♂️ **Citizen Portal**
- **Dashboard**: View vehicle information, pending fines, and recent challans
- **My Challans**: Complete list of traffic violations with search and filter
- **Vehicle Lookup**: Search violations by vehicle number
- **Violation History**: Complete historical record
- **Online Payment**: UPI, Card, and Net Banking integration
- **Driving Tips**: Safety guidelines and traffic rules

### 👮♂️ **Police Officer Portal**
- **Dashboard**: Real-time violation statistics and charts
- **Record Violation**: Upload CCTV footage or live camera detection
- **Detected Violations**: Review AI-detected violations
- **Update Challan Status**: Manage challan lifecycle
- **Analytics**: Violation trends and performance metrics
- **Account Verification**: Requires admin approval before login access

### 🧑💼 **Admin Portal**
- **Dashboard**: System-wide analytics with interactive charts
- **User Management**: Complete CRUD operations for all users
  - Add new users (Citizens, Police, Admins)
  - Edit user information and roles
  - Activate/Deactivate user accounts
  - Verify police officer registrations
  - Delete users with confirmation
- **Violation Management**: Complete violation oversight and status updates
- **Payment Overview**: Revenue tracking with payment method analytics
- **Location Analytics**: Geographic violation distribution and hotspot analysis
- **System Settings**: Configure fine amounts and system parameters
- **Help & Support**: Documentation and contact information

## 🎨 Design Features

- **Modern UI/UX**: Clean, responsive design with dark/light mode toggle
- **Interactive Charts**: Real-time data visualization using Recharts
- **Role-based Access**: Secure authentication with status-based login control
- **Mobile Responsive**: Optimized for all device sizes
- **Loading States**: Smooth user experience with loading indicators
- **Modal Dialogs**: Intuitive forms and confirmation dialogs
- **Search & Filter**: Advanced filtering capabilities across all data tables

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with Hooks (via CDN)
- **State Management**: React Context API with useAuth hook
- **Charts**: Recharts library for data visualization
- **Styling**: Inline styles with dynamic theme system
- **Icons**: Emoji-based icon system
- **Responsive Design**: Mobile-first approach

### Backend
- **Runtime**: Node.js with ES6 modules
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: bcryptjs for password hashing
- **API**: RESTful API with serverless functions
- **Deployment**: Vercel serverless functions

### Security
- **Password Hashing**: bcryptjs with salt rounds
- **Role-based Access Control**: User roles (citizen, police, admin)
- **Status-based Login**: Account verification for police officers
- **CORS**: Cross-origin resource sharing configured
- **Input Validation**: Client and server-side validation

## 📁 Project Structure

```
Yatayat/
├── api/                    # Serverless API functions
│   ├── users/             # User management endpoints
│   │   ├── [id]/         # Dynamic user operations
│   │   │   └── status.js # User status updates
│   │   └── [id].js       # User CRUD operations
│   ├── login.js          # Authentication endpoint
│   ├── register.js       # User registration
│   ├── test.js          # Database connection test
│   └── users.js         # Get all users
├── components/            # React components (modular)
│   ├── citizen/          # Citizen-specific components
│   ├── police/           # Police-specific components
│   ├── utils/            # Utility components
│   ├── AdminDashboard.js
│   ├── AdminHelpSupport.js
│   ├── HelpSupport.js
│   ├── LocationAnalytics.js
│   ├── PaymentOverview.js
│   ├── SystemSettings.js
│   ├── UserManagement.js
│   └── ViolationManagement.js
├── lib/
│   └── mongodb.js        # Database connection utility
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── app.js               # Main React application
├── index.html           # Entry point
├── package.json         # Dependencies and scripts
├── server.js            # Local development server
├── vercel.json          # Vercel deployment configuration
├── yatayat_logo.png     # Application logo
└── README.md            # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB Atlas** account (for database)
- **Vercel** account (for deployment)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Yatayat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yatayat
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Database Setup**
   - Create a MongoDB Atlas cluster
   - Add your IP to Network Access (or use 0.0.0.0/0 for development)
   - Create a database user with read/write permissions
   - Update the MONGODB_URI in your .env file

5. **Run the application**
   ```bash
   # Start local development server
   npm run dev
   
   # Or serve static files
   npm start
   ```

6. **Access the application**
   - Local: `http://localhost:5000`
   - Static: Open `index.html` in browser

### Production Deployment (Vercel)

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Configure build settings (auto-detected)

2. **Set Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yatayat
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   ```

3. **Deploy**
   - Push to main branch for automatic deployment
   - Or use Vercel CLI: `vercel --prod`

## 🔐 User Authentication

### Account Types & Access Control

#### **Admin Account**
- **Full System Access**: Complete control over all features
- **User Management**: Create, edit, delete, and manage all user accounts
- **Police Verification**: Approve police officer registrations
- **System Configuration**: Modify settings and fine amounts
- **🔒 Security Restriction**: Admin login only via email/password (Google auth disabled for security)

#### **Police Officer Account**
- **Registration**: Self-registration with pending status
- **Verification Required**: Admin must verify before login access
- **Status-based Login**: Cannot login until status is "Active"
- **Violation Management**: Record and manage traffic violations

#### **Citizen Account**
- **Immediate Access**: Active status upon registration
- **Vehicle Management**: Link multiple vehicles to account
- **Challan Tracking**: View and pay traffic violations
- **Payment Integration**: Multiple payment methods supported

### Registration Process

1. **Citizens**: Register → Immediate active status → Can login (Email/Password or Google)
2. **Police Officers**: Register → Pending status → Admin verification required → Can login (Email/Password or Google)
3. **Admins**: Created by existing admins through user management → **Email/Password login only**

### Google Authentication Security

- **Citizens & Police**: Full Google authentication support with profile sync
- **Administrators**: Google authentication **disabled for security** - must use email/password
- **Account Linking**: Existing accounts can be linked to Google (except admin accounts)
- **Role Restrictions**: Admin role cannot be selected during Google sign-up

### Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **Role Validation**: Server-side role verification
- **Status Checks**: Account status validation on login
- **Session Management**: Token-based authentication
- **Input Sanitization**: XSS and injection prevention
- **Google Auth Security**: Admin login restricted to email/password only
- **Multi-level Authentication**: Separate auth flows for different user roles

## 🎯 Key Functionalities

### User Management System
- **Complete CRUD Operations**: Create, Read, Update, Delete users
- **Role-based Access Control**: Citizen, Police, Admin roles
- **Account Status Management**: Active, Inactive, Pending states
- **Police Verification Workflow**: Admin approval required for police accounts
- **Bulk Operations**: Search, filter, and manage multiple users
- **Real-time Updates**: Instant UI updates after database operations

### Traffic Violation Management
- **Violation Recording**: Digital challan generation
- **Status Tracking**: Pending, Paid, Cancelled states
- **Search & Filter**: Advanced filtering by status, type, date
- **Violation Types**: Helmet, Red light, Triple riding, Speeding
- **Fine Management**: Configurable fine amounts per violation type

### Payment & Revenue System
- **Payment Tracking**: Complete payment history and analytics
- **Revenue Analytics**: Monthly trends and collection rates
- **Payment Methods**: UPI (65%), Net Banking (25%), Cash (10%)
- **Status Management**: Real-time payment status updates
- **Financial Reports**: Revenue distribution and performance metrics

### Analytics & Reporting
- **Interactive Dashboards**: Role-specific analytics views
- **Data Visualization**: Recharts integration for charts and graphs
- **Location Analytics**: Geographic violation distribution
- **Trend Analysis**: Historical data insights and patterns
- **Performance Metrics**: System-wide KPIs and statistics

### System Administration
- **Fine Configuration**: Adjustable penalty amounts
- **System Settings**: Feature toggles and configurations
- **User Activity Monitoring**: Account status and activity tracking
- **Database Management**: MongoDB integration with proper indexing

## 🎨 UI/UX Features

### Theme System
- **Dynamic Theme Toggle**: Seamless dark/light mode switching
- **Consistent Color Palette**: Unified design system across all components
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG compliant color contrasts and interactions

### Navigation & User Experience
- **Role-based Menus**: Customized sidebar navigation per user type
- **Modal Dialogs**: Intuitive forms for create, edit, and delete operations
- **Loading States**: Smooth loading indicators for all async operations
- **Error Handling**: User-friendly error messages and validation
- **Search & Filter**: Real-time search with multiple filter criteria
- **Confirmation Dialogs**: Safe deletion with user confirmation

### Interactive Components
- **Data Tables**: Sortable, searchable, and filterable tables
- **Status Badges**: Visual status indicators with color coding
- **Action Buttons**: Context-aware buttons with loading states
- **Form Validation**: Real-time client-side validation
- **Notification System**: Toast notifications for user feedback

## 📊 Data Visualization

### Dashboard Analytics
- **Admin Dashboard**: System-wide metrics with violation trends and revenue analytics
- **Payment Overview**: Revenue trends, payment method distribution, and collection rates
- **Location Analytics**: Geographic hotspot analysis with violation distribution
- **User Statistics**: User growth, role distribution, and activity metrics

### Chart Types & Interactions
- **Line Charts**: Violation trends over time periods
- **Bar Charts**: Location-based violation comparisons
- **Pie Charts**: Payment status and method distributions
- **Area Charts**: Revenue trends with filled areas
- **Responsive Charts**: Auto-scaling based on screen size
- **Interactive Tooltips**: Detailed data on hover
- **Color-coded Legends**: Clear data categorization

## 🔒 Security & Data Protection

### Authentication & Authorization
- **Secure Password Hashing**: bcryptjs with 12 salt rounds
- **Role-based Access Control**: Strict role validation (citizen, police, admin)
- **Status-based Login Control**: Account verification for police officers
- **Session Management**: Token-based authentication with localStorage
- **Route Protection**: Client-side route guards based on user roles

### Data Security
- **Input Validation**: Comprehensive client and server-side validation
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Secure data handling and sanitization
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Secure configuration management
- **Database Security**: MongoDB Atlas with network access controls

### API Security
- **Request Validation**: Proper HTTP method validation
- **Error Handling**: Secure error messages without sensitive data exposure
- **Connection Management**: Proper database connection cleanup
- **Timeout Configuration**: Request timeout limits to prevent hanging connections

## 🌟 Advanced Features

### Database Integration
- **MongoDB Atlas**: Cloud-hosted database with global distribution
- **Connection Pooling**: Efficient database connection management
- **Error Recovery**: Robust error handling with connection retry logic
- **Data Validation**: Schema validation at database level
- **Indexing**: Optimized queries with proper database indexing

### API Architecture
- **RESTful Design**: Standard HTTP methods and status codes
- **Serverless Functions**: Vercel serverless deployment
- **Dynamic Routing**: Parameterized routes for resource operations
- **CORS Support**: Cross-origin requests properly configured
- **Error Standardization**: Consistent error response format

### Performance Optimization
- **Lazy Loading**: Components loaded on demand
- **Efficient State Management**: React Context with minimal re-renders
- **Database Optimization**: Efficient queries with projection
- **CDN Integration**: Static assets served via CDN
- **Responsive Images**: Optimized image loading

### Development Features
- **Hot Reloading**: Development server with live updates
- **Environment Configuration**: Separate dev/prod configurations
- **Error Boundaries**: Graceful error handling in React
- **Code Splitting**: Modular component architecture
- **Type Safety**: Consistent data structures and validation

## 🚀 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Analytics**: Machine learning for violation prediction
- **Mobile Application**: React Native mobile app
- **Payment Gateway**: Integration with actual payment processors
- **Document Management**: PDF generation for challans and reports
- **Audit Logging**: Complete user activity tracking
- **Backup & Recovery**: Automated database backup system

### Scalability Improvements
- **Microservices Architecture**: Service decomposition for better scalability
- **Caching Layer**: Redis integration for improved performance
- **Load Balancing**: Multi-region deployment with load distribution
- **CDN Integration**: Global content delivery network
- **Database Sharding**: Horizontal scaling for large datasets
- **API Rate Limiting**: Request throttling and quota management

### Technical Debt & Optimization
- **TypeScript Migration**: Type safety and better developer experience
- **Testing Suite**: Unit, integration, and E2E testing
- **CI/CD Pipeline**: Automated testing and deployment
- **Performance Monitoring**: Application performance insights
- **Security Auditing**: Regular security assessments and updates

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/yatayat.git
   cd yatayat
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   npm install
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Make your changes**
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Update documentation if needed

5. **Test your changes**
   ```bash
   npm run dev  # Test locally
   # Test all user roles and functionalities
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

7. **Submit a pull request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### Code Style Guidelines

- **React Components**: Use functional components with hooks
- **Naming**: Use camelCase for variables, PascalCase for components
- **File Structure**: Keep components modular and organized
- **Comments**: Add JSDoc comments for complex functions
- **Error Handling**: Always include proper error handling
- **Security**: Never commit sensitive data or credentials

## 🐛 Troubleshooting

### Common Issues

#### **Database Connection Issues**
```bash
# Check MongoDB URI format
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yatayat

# Verify network access in MongoDB Atlas
# Add 0.0.0.0/0 to Network Access for development
```

#### **Vercel Deployment Issues**
```bash
# Ensure environment variables are set in Vercel dashboard
# Check function logs in Vercel dashboard
# Verify API routes are in /api/ directory
```

#### **Login Issues**
```bash
# Police officers need admin verification
# Check user status in database
# Verify password hashing is working
```

### Development Tips

- **Local Testing**: Use MongoDB Compass for database inspection
- **API Testing**: Use browser dev tools or Postman for API testing
- **Error Debugging**: Check browser console and network tab
- **Database Issues**: Use the `/api/test` endpoint to verify connection

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support & Contact

### Technical Support
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive README and inline comments
- **Community**: Open source community contributions welcome

### Project Information
- **Version**: 2.1.0
- **Last Updated**: November 2024
- **Deployment**: Vercel (Production), Local (Development)
- **Database**: MongoDB Atlas (Cloud)

## 🏆 Acknowledgments

### Technology Stack
- **React Team**: For the powerful and flexible framework
- **Recharts**: For beautiful and responsive data visualization
- **MongoDB**: For reliable and scalable database solutions
- **Vercel**: For seamless serverless deployment platform
- **bcryptjs**: For secure password hashing implementation

### Community & Inspiration
- **Open Source Community**: For continuous inspiration and contributions
- **Traffic Management Authorities**: For domain expertise and requirements
- **Web Development Community**: For best practices and security guidelines
- **UI/UX Design Community**: For modern design patterns and accessibility standards

---

## 🎯 Project Goals

**Built with ❤️ for safer roads and smarter traffic management**

*Yatayat aims to revolutionize traffic violation management through digital transformation, providing a comprehensive platform that bridges the gap between citizens, law enforcement, and administrative authorities. Our goal is to create safer roads through transparent, efficient, and user-friendly traffic management systems.*

### Impact Metrics
- **Digital Transformation**: Moving from paper-based to digital challan system
- **Transparency**: Real-time violation tracking and payment processing
- **Efficiency**: Streamlined workflows for police officers and administrators
- **Accessibility**: Mobile-responsive design for all user demographics
- **Scalability**: Cloud-based architecture supporting city-wide deployment

---

**Yatayat - Making roads safer through smart surveillance technology** 🚦