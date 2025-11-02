# Yatayat - Smart Traffic Violation Detection System

**"Smart Surveillance. Safer Roads"**

A comprehensive React-based frontend application for managing traffic violations, designed for citizens, traffic police, and administrators.

## 🚀 Features

### 🧍‍♂️ **Citizen Portal**
- **Dashboard**: View vehicle information, pending fines, and recent challans
- **My Challans**: Complete list of traffic violations with search and filter
- **Vehicle Lookup**: Search violations by vehicle number
- **Violation History**: Complete historical record
- **Online Payment**: UPI, Card, and Net Banking integration
- **Driving Tips**: Safety guidelines and traffic rules

### 👮‍♂️ **Police Officer Portal**
- **Dashboard**: Real-time violation statistics and charts
- **Record Violation**: Upload CCTV footage or live camera detection
- **Detected Violations**: Review AI-detected violations
- **Update Challan Status**: Manage challan lifecycle
- **Analytics**: Violation trends and performance metrics

### 🧑‍💼 **Admin Portal**
- **Dashboard**: System-wide analytics and insights
- **User Management**: Add/edit/remove police officers
- **Violation Management**: Complete violation oversight
- **Payment Overview**: Revenue tracking and reports
- **Location Analytics**: Heatmaps and violation hotspots
- **System Settings**: Configure fines, thresholds, and features

## 🎨 Design Features

- **Modern UI/UX**: Clean, responsive design with dark/light mode
- **Interactive Charts**: Real-time data visualization using Recharts
- **Role-based Access**: Secure authentication and authorization
- **Mobile Responsive**: Works seamlessly on all devices
- **Accessibility**: WCAG compliant design principles

## 🛠️ Technology Stack

- **Frontend**: React 18 (via CDN)
- **Routing**: React Router DOM
- **Charts**: Recharts library
- **Styling**: Inline styles with theme system
- **Icons**: Emoji-based icon system
- **State Management**: React Context API

## 📁 Project Structure

```
Yatayat/
├── index.html          # Main HTML file
├── app.js             # Complete React application
├── logo.svg           # Custom Yatayat logo
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for file:// protocol issues)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd Yatayat
   ```

2. **Open the application**
   - Option 1: Double-click `index.html`
   - Option 2: Use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Access the application**
   - Direct: Open `index.html` in browser
   - Server: Navigate to `http://localhost:8000`

## 🔐 Demo Credentials

### Citizen Account
- **Username**: `john_citizen`
- **Password**: `demo123`
- **Role**: Citizen
- **Vehicles**: MH12AB1234, MH14CD5678

### Police Officer Account
- **Username**: `officer_raj`
- **Password**: `demo123`
- **Role**: Police
- **Officer ID**: POL001

### Admin Account
- **Username**: `admin_system`
- **Password**: `demo123`
- **Role**: Admin

## 🎯 Key Functionalities

### Traffic Violation Detection
- **Video Upload**: Process CCTV footage for violations
- **Live Detection**: Real-time camera monitoring
- **AI Integration**: Automatic number plate recognition
- **Violation Types**: Helmet, Red light, Triple riding, Speeding

### Payment System
- **Multiple Methods**: UPI, Cards, Net Banking
- **Receipt Generation**: Downloadable payment receipts
- **Status Tracking**: Real-time payment status updates

### Analytics & Reporting
- **Interactive Charts**: Bar, Line, Pie, Area charts
- **Location Heatmaps**: Violation hotspot identification
- **Trend Analysis**: Historical data insights
- **Export Options**: CSV, PDF report generation

## 🎨 UI/UX Features

### Theme System
- **Dark Mode**: Eye-friendly dark theme
- **Light Mode**: Clean, bright interface
- **Responsive Design**: Mobile-first approach
- **Consistent Styling**: Unified design language

### Navigation
- **Role-based Menus**: Customized navigation per user type
- **Breadcrumbs**: Clear navigation hierarchy
- **Search Functionality**: Global and contextual search
- **Quick Actions**: One-click common operations

## 📊 Data Visualization

### Charts & Graphs
- **Violation Trends**: Daily, weekly, monthly patterns
- **Payment Analytics**: Revenue and collection rates
- **Location Analysis**: Geographic violation distribution
- **Performance Metrics**: Officer and system KPIs

### Interactive Elements
- **Hover Effects**: Enhanced user interaction
- **Click Actions**: Drill-down capabilities
- **Filter Options**: Dynamic data filtering
- **Real-time Updates**: Live data synchronization

## 🔒 Security Features

### Authentication
- **Role-based Access**: Secure user roles
- **Session Management**: Automatic logout
- **Route Protection**: Unauthorized access prevention

### Data Protection
- **Input Validation**: Client-side validation
- **XSS Prevention**: Secure data handling
- **CSRF Protection**: Request validation

## 🌟 Advanced Features

### Notification System
- **Real-time Alerts**: Instant notifications
- **Email Integration**: Automated email alerts
- **SMS Notifications**: Mobile notifications
- **Push Notifications**: Browser notifications

### Search & Filter
- **Global Search**: System-wide search capability
- **Advanced Filters**: Multi-criteria filtering
- **Sort Options**: Flexible data sorting
- **Export Functions**: Data export capabilities

## 🚀 Future Enhancements

### Planned Features
- **Mobile App**: Native mobile applications
- **API Integration**: Backend service integration
- **Machine Learning**: Enhanced violation detection
- **Blockchain**: Immutable violation records

### Scalability
- **Microservices**: Service-oriented architecture
- **Cloud Deployment**: AWS/Azure integration
- **Load Balancing**: High availability setup
- **CDN Integration**: Global content delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and queries:
- **Email**: support@yatayat.gov.in
- **Phone**: +91-1800-123-4567
- **Hours**: 24/7 Support Available

## 🏆 Acknowledgments

- React team for the amazing framework
- Recharts for beautiful data visualization
- Open source community for inspiration
- Traffic police departments for domain expertise

---

**Built with ❤️ for safer roads and smarter traffic management**

*Yatayat - Making roads safer through smart surveillance technology*