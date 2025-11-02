const { useState, useEffect, createContext, useContext, useMemo } = React;
const { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts || {};

// ==================== MOCK DATA ====================
const mockUsers = [
  { username: "john_citizen", password: "demo123", role: "citizen", vehicleNumbers: ["MH12AB1234", "MH14CD5678"] },
  { username: "officer_raj", password: "demo123", role: "police", officerId: "POL001" },
  { username: "admin_system", password: "demo123", role: "admin" }
];

const mockViolations = [
  { challanId: "CH001", vehicleNumber: "MH12AB1234", violationType: "helmet", timestamp: "2025-11-01T14:30:00", location: "MG Road Junction", fineAmount: 1000, officerId: "POL001", status: "Pending" },
  { challanId: "CH002", vehicleNumber: "MH12AB1234", violationType: "red_light", timestamp: "2025-10-28T09:15:00", location: "FC Road Signal", fineAmount: 5000, officerId: "POL001", status: "Paid" },
  { challanId: "CH003", vehicleNumber: "DL10XY9876", violationType: "triple_riding", timestamp: "2025-11-02T11:45:00", location: "Baner Chowk", fineAmount: 2000, officerId: "POL002", status: "Pending" },
  { challanId: "CH004", vehicleNumber: "MH14CD5678", violationType: "speeding", timestamp: "2025-10-30T16:20:00", location: "Highway Express", fineAmount: 3000, officerId: "POL001", status: "Cancelled" },
  { challanId: "CH005", vehicleNumber: "MH12AB1234", violationType: "speeding", timestamp: "2025-10-25T10:00:00", location: "Highway Express", fineAmount: 3000, officerId: "POL001", status: "Paid" }
];

const violationStats = {
  today: 24,
  thisWeek: 156,
  thisMonth: 642,
  byType: [
    { type: "helmet", count: 245 },
    { type: "red_light", count: 187 },
    { type: "triple_riding", count: 134 },
    { type: "speeding", count: 76 }
  ]
};

const violationsPerDay = [
  { date: "10-27", count: 18 },
  { date: "10-28", count: 25 },
  { date: "10-29", count: 22 },
  { date: "10-30", count: 31 },
  { date: "10-31", count: 28 },
  { date: "11-01", count: 24 },
  { date: "11-02", count: 8 }
];

const fineDistribution = [
  { category: "Paid", amount: 234000, percentage: 65 },
  { category: "Pending", amount: 98000, percentage: 27 },
  { category: "Cancelled", amount: 28000, percentage: 8 }
];

const paymentTrends = [
  { month: "Jun", revenue: 145000 },
  { month: "Jul", revenue: 178000 },
  { month: "Aug", revenue: 165000 },
  { month: "Sep", revenue: 192000 },
  { month: "Oct", revenue: 234000 },
  { month: "Nov", revenue: 98000 }
];

const topLocations = [
  { location: "MG Road Junction", violations: 45 },
  { location: "FC Road Signal", violations: 38 },
  { location: "Baner Chowk", violations: 32 },
  { location: "Highway Express", violations: 28 },
  { location: "Kothrud Depot", violations: 21 }
];

const LOGO_URL = "./yatayat_logo.png";

const COLORS = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];

// ==================== AUTH CONTEXT ====================
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New challan generated for MH12AB1234", type: "warning", read: false },
    { id: 2, message: "Payment confirmed for CH002", type: "success", read: false },
    { id: 3, message: "System update completed successfully", type: "info", read: true }
  ]);

  const login = (username, password, role) => {
    console.log('Login attempt:', { username, role });
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password && u.role === role
    );
    
    if (foundUser) {
      console.log('Login successful:', foundUser.username);
      setUser(foundUser);
      return true;
    }
    console.log('Login failed: Invalid credentials');
    return false;
  };

  const logout = () => {
    console.log('User logged out');
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, darkMode, toggleDarkMode, notifications, markNotificationRead }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ==================== PRIVATE ROUTE ====================
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// ==================== STYLES ====================
const getStyles = (darkMode) => ({
  // Colors
  primary: '#2563EB',
  secondary: '#F97316',
  dark: darkMode ? '#111827' : '#1F2937',
  light: darkMode ? '#1F2937' : '#F3F4F6',
  background: darkMode ? '#0F172A' : '#FFFFFF',
  cardBg: darkMode ? '#1E293B' : '#FFFFFF',
  text: darkMode ? '#F3F4F6' : '#1F2937',
  textSecondary: darkMode ? '#9CA3AF' : '#6B7280',
  border: darkMode ? '#334155' : '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Layout
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px'
  },
  
  // Cards
  card: {
    background: darkMode ? '#1E293B' : '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
    border: `1px solid ${darkMode ? '#334155' : '#E5E7EB'}`
  },
  
  // Buttons
  button: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    minHeight: '44px',
    touchAction: 'manipulation'
  },
  
  // Tables
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  
  th: {
    background: darkMode ? '#334155' : '#F9FAFB',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: darkMode ? '#F3F4F6' : '#374151',
    borderBottom: `2px solid ${darkMode ? '#475569' : '#E5E7EB'}`
  },
  
  td: {
    padding: '12px',
    borderBottom: `1px solid ${darkMode ? '#334155' : '#E5E7EB'}`,
    fontSize: '14px',
    color: darkMode ? '#D1D5DB' : '#4B5563'
  },
  
  // Input
  input: {
    width: '100%',
    padding: '14px 12px',
    borderRadius: '8px',
    border: `1px solid ${darkMode ? '#334155' : '#D1D5DB'}`,
    background: darkMode ? '#1E293B' : '#FFFFFF',
    color: darkMode ? '#F3F4F6' : '#1F2937',
    fontSize: '16px',
    minHeight: '44px',
    touchAction: 'manipulation'
  }
});

// ==================== COMPONENTS ====================

// Loading Component
const LoadingSpinner = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: styles.textSecondary
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: `4px solid ${styles.border}`,
        borderTop: `4px solid ${styles.primary}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Search Component
const SearchBar = ({ placeholder, value, onChange, onSearch }) => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && onSearch && onSearch()}
        style={{
          ...styles.input,
          paddingRight: '40px'
        }}
      />
      {onSearch && (
        <button
          onClick={onSearch}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: styles.textSecondary
          }}
        >
          🔍
        </button>
      )}
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode, notifications } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const styles = getStyles(darkMode);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  
  return (
    <div style={{
      background: styles.cardBg,
      borderBottom: `1px solid ${styles.border}`,
      padding: window.innerWidth < 768 ? '12px 16px' : '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img src={LOGO_URL} alt="Yatayat Logo" style={{ height: '40px' }} />
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: styles.text }}>Yatayat</div>
          <div style={{ fontSize: '11px', color: styles.textSecondary }}>Smart Surveillance. Safer Roads</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          style={{
            ...styles.button,
            background: 'transparent',
            padding: '8px',
            fontSize: '20px'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              ...styles.button,
              background: 'transparent',
              padding: '8px',
              position: 'relative'
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: styles.error,
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: styles.cardBg,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: '320px',
              maxHeight: '400px',
              overflow: 'auto',
              border: `1px solid ${styles.border}`
            }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${styles.border}`, fontWeight: '600', color: styles.text }}>
                Notifications
              </div>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${styles.border}`,
                    background: notif.read ? 'transparent' : (darkMode ? '#334155' : '#F0F9FF'),
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', color: styles.text }}>{notif.message}</div>
                  <div style={{ fontSize: '11px', color: styles.textSecondary, marginTop: '4px' }}>
                    {notif.type === 'success' && '✓ '}
                    {notif.type === 'warning' && '⚠ '}
                    {notif.type === 'info' && 'ℹ '}
                    {notif.type}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{
              ...styles.button,
              background: styles.primary,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>👤</span>
            <span>{user?.username}</span>
          </button>
          
          {showProfile && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: styles.cardBg,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '180px',
              border: `1px solid ${styles.border}`
            }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${styles.border}` }}>
                <div style={{ fontWeight: '600', color: styles.text }}>{user?.username}</div>
                <div style={{ fontSize: '12px', color: styles.textSecondary, textTransform: 'capitalize' }}>
                  {user?.role}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: styles.error,
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ role }) => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const menuItems = {
    citizen: [
      { path: '/citizen/dashboard', icon: '🏠', label: 'Dashboard' },
      { path: '/citizen/challans', icon: '📋', label: 'My Challans' },
      { path: '/citizen/lookup', icon: '🔍', label: 'Vehicle Lookup' },
      { path: '/citizen/history', icon: '📊', label: 'Violation History' },
      { path: '/help', icon: '❓', label: 'Help & Support' }
    ],
    police: [
      { path: '/police/dashboard', icon: '🏠', label: 'Dashboard' },
      { path: '/police/record', icon: '🎥', label: 'Record Violation' },
      { path: '/police/detected', icon: '📸', label: 'Detected Violations' },
      { path: '/police/update', icon: '✏️', label: 'Update Challan' },
      { path: '/help', icon: '❓', label: 'Help & Support' }
    ],
    admin: [
      { path: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
      { path: '/admin/users', icon: '👥', label: 'User Management' },
      { path: '/admin/violations', icon: '🚦', label: 'Violation Management' },
      { path: '/admin/payments', icon: '💰', label: 'Payment Overview' },
      { path: '/admin/analytics', icon: '📍', label: 'Location Analytics' },
      { path: '/admin/settings', icon: '⚙️', label: 'System Settings' },
      { path: '/help', icon: '❓', label: 'Help & Support' }
    ]
  };
  
  const items = menuItems[role] || [];
  
  return (
    <div style={{
      width: window.innerWidth < 768 ? '100%' : '250px',
      background: styles.cardBg,
      borderRight: window.innerWidth < 768 ? 'none' : `1px solid ${styles.border}`,
      height: window.innerWidth < 768 ? 'auto' : 'calc(100vh - 73px)',
      overflowY: 'auto',
      padding: window.innerWidth < 768 ? '12px 0' : '20px 0',
      position: window.innerWidth < 768 ? 'fixed' : 'static',
      bottom: window.innerWidth < 768 ? 0 : 'auto',
      zIndex: window.innerWidth < 768 ? 999 : 'auto',
      display: window.innerWidth < 768 ? 'flex' : 'block'
    }}>
      {items.map(item => (
        <div
          key={item.path}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            cursor: 'pointer',
            color: styles.text,
            background: 'transparent',
            borderLeft: '3px solid transparent',
            fontWeight: '400',
            transition: 'all 0.2s ease',
            borderTop: item.label === 'Help & Support' ? `1px solid ${styles.border}` : 'none',
            marginTop: item.label === 'Help & Support' ? '12px' : '0'
          }}
        >
          <span style={{ fontSize: '18px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, subtitle }) => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div style={{
      ...styles.card,
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      minWidth: '220px'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        background: color + '20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: styles.text }}>{value}</div>
        {subtitle && <div style={{ fontSize: '11px', color: styles.textSecondary, marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const colors = {
    Paid: { bg: '#DCFCE7', text: '#166534' },
    Pending: { bg: '#FEF3C7', text: '#92400E' },
    Cancelled: { bg: '#F3F4F6', text: '#4B5563' },
    Detected: { bg: '#DBEAFE', text: '#1E40AF' },
    'Challan Generated': { bg: '#DCFCE7', text: '#166534' },
    Rejected: { bg: '#FEE2E2', text: '#991B1B' }
  };
  
  const color = colors[status] || colors.Pending;
  
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: color.bg,
      color: color.text,
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: styles.cardBg,
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${styles.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600' }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: styles.textSecondary
          }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ==================== LOGIN PAGE ====================
const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const [vehicleNumbers, setVehicleNumbers] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login, darkMode, toggleDarkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { isLogin, username, role });
    setError('');
    
    if (isLogin) {
      const success = login(username, password, role);
      if (success) {
        console.log('Redirecting to dashboard');
        onLogin && onLogin();
      } else {
        console.log('Setting error message');
        setError('Invalid credentials. Please try again.');
      }
    } else {
      if (password !== confirmPassword) {
        console.log('Password mismatch');
        setError('Passwords do not match');
        return;
      }
      console.log('Registration attempt');
      setError('Registration successful! Please login.');
      setIsLogin(true);
    }
  };
  
  return (
    <div className="animate-fade" style={{
      minHeight: '100vh',
      background: darkMode ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: window.innerWidth < 768 ? '16px' : '20px'
    }}>
      <div className="animate-fade" style={{
        ...styles.card,
        maxWidth: window.innerWidth < 768 ? '100%' : '450px',
        width: '100%',
        position: 'relative'
      }}>
        <button
          onClick={toggleDarkMode}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 0.3s ease'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={LOGO_URL} alt="Yatayat Logo" style={{ height: '80px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: styles.text, marginBottom: '8px' }}>Yatayat</h1>
          <p style={{ fontSize: '16px', color: styles.textSecondary }}>Smart Surveillance. Safer Roads</p>
        </div>
        
        <div style={{ display: 'flex', marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', background: styles.light }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: isLogin ? styles.primary : 'transparent',
              color: isLogin ? 'white' : styles.text,
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: !isLogin ? styles.primary : 'transparent',
              color: !isLogin ? 'white' : styles.text,
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Register
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', fontSize: '14px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
              placeholder="Enter username"
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              placeholder="Enter password"
            />
          </div>
          
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', fontSize: '14px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
                placeholder="Confirm password"
              />
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', fontSize: '14px' }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
              required
            >
              <option value="citizen">Citizen</option>
              <option value="police">Traffic Police</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {!isLogin && role === 'citizen' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', fontSize: '14px' }}>
                Vehicle Numbers (comma separated)
              </label>
              <input
                type="text"
                value={vehicleNumbers}
                onChange={(e) => setVehicleNumbers(e.target.value)}
                style={styles.input}
                placeholder="e.g., MH12AB1234, MH14CD5678"
              />
            </div>
          )}
          
          {error && (
            <div style={{
              padding: '12px',
              background: error.includes('successful') ? '#DCFCE7' : '#FEE2E2',
              color: error.includes('successful') ? '#166534' : '#991B1B',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            style={{
              ...styles.button,
              width: '100%',
              background: styles.primary,
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              padding: '14px'
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
          
          {isLogin && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a href="#" style={{ color: styles.primary, fontSize: '14px', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
          )}
        </form>
        
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: styles.light,
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '8px', fontWeight: '600' }}>Demo Credentials:</div>
          <div style={{ fontSize: '11px', color: styles.textSecondary, lineHeight: '1.6' }}>
            <div>Citizen: john_citizen / demo123</div>
            <div>Police: officer_raj / demo123</div>
            <div>Admin: admin_system / demo123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== CITIZEN PAGES ====================

// Driving Tips Component
const DrivingTips = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const tips = [
    { icon: '🪖', title: 'Always Wear Helmet', desc: 'Protect yourself and avoid fines' },
    { icon: '🚦', title: 'Follow Traffic Signals', desc: 'Stop at red lights and follow rules' },
    { icon: '👥', title: 'Avoid Triple Riding', desc: 'Maximum 2 people on two-wheelers' },
    { icon: '⚡', title: 'Control Speed', desc: 'Stay within speed limits' },
    { icon: '📱', title: 'No Phone While Driving', desc: 'Focus on the road ahead' },
    { icon: '🚗', title: 'Proper Parking', desc: 'Park only in designated areas' }
  ];
  
  return (
    <div style={styles.card}>
      <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>🎯 Driving Tips</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {tips.map((tip, index) => (
          <div key={index} style={{
            padding: '16px',
            background: styles.light,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>{tip.icon}</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: styles.text }}>{tip.title}</div>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginTop: '4px' }}>{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CitizenDashboard = () => {
  const { user, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const userChallans = mockViolations.filter(v => 
    user?.vehicleNumbers?.includes(v.vehicleNumber)
  );
  
  const pendingFines = userChallans.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.fineAmount, 0);
  const paidFines = userChallans.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.fineAmount, 0);
  const recentChallans = userChallans.slice(0, 5);
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
        Welcome, {user?.username}!
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Vehicles" value={user?.vehicleNumbers?.length || 0} icon="🚗" color="#2563EB" />
        <StatCard title="Pending Fines" value={`₹${pendingFines}`} icon="⚠️" color="#F59E0B" />
        <StatCard title="Total Fines Paid" value={`₹${paidFines}`} icon="✓" color="#10B981" />
        <StatCard title="Total Challans" value={userChallans.length} icon="📋" color="#8B5CF6" />
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Recent Challans</h3>
        
        {recentChallans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: styles.textSecondary }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '18px', fontWeight: '500' }}>No Challans Found</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>You have a clean driving record!</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Challan ID</th>
                  <th style={styles.th}>Violation Type</th>
                  <th style={styles.th}>Date &amp; Time</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentChallans.map(challan => (
                  <tr key={challan.challanId} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = styles.light} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={styles.td}>{challan.challanId}</td>
                    <td style={styles.td}>
                      <span style={{ textTransform: 'capitalize' }}>{challan.violationType.replace('_', ' ')}</span>
                    </td>
                    <td style={styles.td}>{new Date(challan.timestamp).toLocaleString()}</td>
                    <td style={styles.td}>{challan.location}</td>
                    <td style={styles.td}>₹{challan.fineAmount}</td>
                    <td style={styles.td}><StatusBadge status={challan.status} /></td>
                    <td style={styles.td}>
                      <button
                        onClick={() => setSelectedChallan(challan)}
                        style={{
                          ...styles.button,
                          background: styles.primary,
                          color: 'white',
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                      >
                        View Details
                      </button>
                      {challan.status === 'Pending' && (
                        <button
                          onClick={() => {
                            setSelectedChallan(challan);
                            setShowPaymentModal(true);
                          }}
                          style={{
                            ...styles.button,
                            background: styles.success,
                            color: 'white',
                            padding: '6px 12px',
                            fontSize: '12px',
                            marginLeft: '8px'
                          }}
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <DrivingTips />
      
      {/* Challan Details Modal */}
      <Modal isOpen={selectedChallan && !showPaymentModal} onClose={() => setSelectedChallan(null)} title="Challan Details">
        {selectedChallan && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Challan ID</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: styles.text }}>{selectedChallan.challanId}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <StatusBadge status={selectedChallan.status} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Vehicle Number</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedChallan.vehicleNumber}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Violation Type</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text, textTransform: 'capitalize' }}>
                {selectedChallan.violationType.replace('_', ' ')}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Date &amp; Time</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>
                {new Date(selectedChallan.timestamp).toLocaleString()}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Location</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedChallan.location}</div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Fine Amount</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: styles.error }}>₹{selectedChallan.fineAmount}</div>
            </div>
            <div style={{
              padding: '16px',
              background: styles.light,
              borderRadius: '8px',
              textAlign: 'center',
              color: styles.textSecondary,
              marginBottom: '16px'
            }}>
              📷 Violation Image Placeholder
            </div>
            {selectedChallan.status === 'Paid' && (
              <button style={{
                ...styles.button,
                width: '100%',
                background: styles.primary,
                color: 'white'
              }}>
                📄 Download Receipt
              </button>
            )}
          </div>
        )}
      </Modal>
      
      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Pay Challan">
        {selectedChallan && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: styles.textSecondary, marginBottom: '8px' }}>Challan ID: {selectedChallan.challanId}</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: styles.text }}>₹{selectedChallan.fineAmount}</div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: styles.text, marginBottom: '12px' }}>Select Payment Method</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button style={{
                  ...styles.button,
                  background: styles.light,
                  color: styles.text,
                  justifyContent: 'flex-start',
                  padding: '16px',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <span style={{ marginRight: '12px' }}>📱</span> UPI Payment
                </button>
                <button style={{
                  ...styles.button,
                  background: styles.light,
                  color: styles.text,
                  justifyContent: 'flex-start',
                  padding: '16px',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <span style={{ marginRight: '12px' }}>💳</span> Credit/Debit Card
                </button>
                <button style={{
                  ...styles.button,
                  background: styles.light,
                  color: styles.text,
                  justifyContent: 'flex-start',
                  padding: '16px',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <span style={{ marginRight: '12px' }}>🏦</span> Net Banking
                </button>
              </div>
            </div>
            
            <button
              onClick={() => {
                alert('Payment Successful! (Demo Mode)');
                setShowPaymentModal(false);
                setSelectedChallan(null);
              }}
              style={{
                ...styles.button,
                width: '100%',
                background: styles.success,
                color: 'white',
                fontWeight: '600'
              }}
            >
              Confirm Payment
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const CitizenChallans = () => {
  const { user, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const userChallans = mockViolations.filter(v => 
    user?.vehicleNumbers?.includes(v.vehicleNumber)
  );
  
  const filteredChallans = userChallans.filter(c => {
    const matchesSearch = c.challanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>My Challans</h2>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <SearchBar
            placeholder="Search by Challan ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ ...styles.input, width: 'auto', minWidth: '150px' }}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Challan ID</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Violation Type</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredChallans.map(challan => (
                <tr key={challan.challanId}>
                  <td style={styles.td}>{challan.challanId}</td>
                  <td style={styles.td}>{challan.vehicleNumber}</td>
                  <td style={styles.td}>
                    <span style={{ textTransform: 'capitalize' }}>{challan.violationType.replace('_', ' ')}</span>
                  </td>
                  <td style={styles.td}>{new Date(challan.timestamp).toLocaleDateString()}</td>
                  <td style={styles.td}>{challan.location}</td>
                  <td style={styles.td}>₹{challan.fineAmount}</td>
                  <td style={styles.td}><StatusBadge status={challan.status} /></td>
                  <td style={styles.td}>
                    <button
                      onClick={() => setSelectedChallan(challan)}
                      style={{
                        ...styles.button,
                        background: styles.primary,
                        color: 'white',
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredChallans.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: styles.textSecondary }}>
            No challans found
          </div>
        )}
      </div>
      
      <Modal isOpen={!!selectedChallan} onClose={() => setSelectedChallan(null)} title="Challan Details">
        {selectedChallan && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Challan ID</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: styles.text }}>{selectedChallan.challanId}</div>
            </div>
            <StatusBadge status={selectedChallan.status} />
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Fine Amount</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: styles.error }}>₹{selectedChallan.fineAmount}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const VehicleLookup = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSearch = () => {
    if (!vehicleNumber.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      const found = mockViolations.filter(v => 
        v.vehicleNumber.toLowerCase().includes(vehicleNumber.toLowerCase())
      );
      setResults(found);
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Vehicle Lookup</h2>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <SearchBar
            placeholder="Enter Vehicle Number (e.g., MH12AB1234)"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            onSearch={handleSearch}
          />
          <button
            onClick={handleSearch}
            style={{
              ...styles.button,
              background: styles.primary,
              color: 'white'
            }}
          >
            🔍 Search
          </button>
        </div>
        
        {loading && <LoadingSpinner />}
        
        {!loading && results !== null && (
          <div>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: styles.textSecondary }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <div style={{ fontSize: '18px', fontWeight: '500' }}>No Challans Found</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>This vehicle has a clean record!</div>
              </div>
            ) : (
              <div>
                <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  Found {results.length} challan(s) for {vehicleNumber.toUpperCase()}
                </h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Challan ID</th>
                      <th style={styles.th}>Violation Type</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(challan => (
                      <tr key={challan.challanId}>
                        <td style={styles.td}>{challan.challanId}</td>
                        <td style={styles.td}>
                          <span style={{ textTransform: 'capitalize' }}>{challan.violationType.replace('_', ' ')}</span>
                        </td>
                        <td style={styles.td}>{new Date(challan.timestamp).toLocaleDateString()}</td>
                        <td style={styles.td}>{challan.location}</td>
                        <td style={styles.td}>₹{challan.fineAmount}</td>
                        <td style={styles.td}><StatusBadge status={challan.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ViolationHistory = () => {
  const { user, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const userChallans = mockViolations.filter(v => 
    user?.vehicleNumbers?.includes(v.vehicleNumber)
  );
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Violation History</h2>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Complete History</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Challan ID</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Violation</th>
                <th style={styles.th}>Date &amp; Time</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {userChallans.map(challan => (
                <tr key={challan.challanId}>
                  <td style={styles.td}>{challan.challanId}</td>
                  <td style={styles.td}>{challan.vehicleNumber}</td>
                  <td style={styles.td}>
                    <span style={{ textTransform: 'capitalize' }}>{challan.violationType.replace('_', ' ')}</span>
                  </td>
                  <td style={styles.td}>{new Date(challan.timestamp).toLocaleString()}</td>
                  <td style={styles.td}>{challan.location}</td>
                  <td style={styles.td}>₹{challan.fineAmount}</td>
                  <td style={styles.td}><StatusBadge status={challan.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==================== POLICE PAGES ====================

const PoliceDashboard = () => {
  const { user, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
        Welcome, Officer {user?.officerId}!
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Violations Today" value={violationStats.today} icon="📊" color="#2563EB" />
        <StatCard title="Violations This Week" value={violationStats.thisWeek} icon="📈" color="#F59E0B" />
        <StatCard title="Violations This Month" value={violationStats.thisMonth} icon="📅" color="#10B981" />
        <StatCard title="Pending Challans" value={mockViolations.filter(v => v.status === 'Pending').length} icon="⚠️" color="#EF4444" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Violation Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationStats.byType}>
              <CartesianGrid strokeDasharray="3 3" stroke={styles.border} />
              <XAxis dataKey="type" stroke={styles.textSecondary} />
              <YAxis stroke={styles.textSecondary} />
              <Tooltip contentStyle={{ background: styles.cardBg, border: `1px solid ${styles.border}` }} />
              <Bar dataKey="count" fill={styles.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Violations Per Day (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={violationsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke={styles.border} />
              <XAxis dataKey="date" stroke={styles.textSecondary} />
              <YAxis stroke={styles.textSecondary} />
              <Tooltip contentStyle={{ background: styles.cardBg, border: `1px solid ${styles.border}` }} />
              <Line type="monotone" dataKey="count" stroke={styles.primary} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockViolations.slice(0, 5).map(v => (
            <div key={v.challanId} style={{
              padding: '12px',
              background: styles.light,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: styles.text }}>
                  {v.challanId} - {v.vehicleNumber}
                </div>
                <div style={{ fontSize: '12px', color: styles.textSecondary, marginTop: '4px' }}>
                  {v.violationType.replace('_', ' ')} at {v.location}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>
                {new Date(v.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecordViolation = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [mode, setMode] = useState('upload');
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [detectionsCount, setDetectionsCount] = useState(0);
  
  const handleProcessVideo = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setDetectionsCount(Math.floor(Math.random() * 10) + 3);
    }, 2000);
  };
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Record Violation</h2>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', background: styles.light }}>
          <button
            onClick={() => setMode('upload')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: mode === 'upload' ? styles.primary : 'transparent',
              color: mode === 'upload' ? 'white' : styles.text,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📤 Upload Video
          </button>
          <button
            onClick={() => setMode('live')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: mode === 'live' ? styles.primary : 'transparent',
              color: mode === 'live' ? 'white' : styles.text,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📹 Live Camera
          </button>
        </div>
        
        {mode === 'upload' ? (
          <div>
            <div style={{
              padding: '40px',
              border: `2px dashed ${styles.border}`,
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
              <div style={{ fontSize: '16px', color: styles.text, marginBottom: '8px', fontWeight: '500' }}>
                Choose CCTV footage or drop file here
              </div>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Supported formats: MP4, AVI, MOV</div>
              <input type="file" accept="video/*" style={{ marginTop: '16px' }} />
            </div>
            
            <button
              onClick={handleProcessVideo}
              disabled={processing}
              style={{
                ...styles.button,
                background: styles.primary,
                color: 'white',
                width: '100%'
              }}
            >
              {processing ? '⏳ Processing Video...' : '▶️ Process Video'}
            </button>
            
            {processed && (
              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: '#DCFCE7',
                color: '#166534',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Processing Complete!
                </div>
                <div style={{ fontSize: '16px', marginBottom: '16px' }}>
                  {detectionsCount} violations detected
                </div>
                <button style={{
                  ...styles.button,
                  background: '#166534',
                  color: 'white'
                }}>
                  View Detected Violations →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{
              padding: '60px',
              background: styles.light,
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📹</div>
              <div style={{ fontSize: '18px', color: styles.text, marginBottom: '8px', fontWeight: '500' }}>
                Connect to CCTV/Webcam
              </div>
              <div style={{ fontSize: '14px', color: styles.textSecondary }}>
                Live detection will start automatically
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                ...styles.button,
                flex: 1,
                background: styles.success,
                color: 'white'
              }}>
                ▶️ Start Detection
              </button>
              <button style={{
                ...styles.button,
                flex: 1,
                background: styles.error,
                color: 'white'
              }}>
                ⏹ Stop Detection
              </button>
            </div>
            
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: styles.light,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: styles.text }}>Real-time Violation Counter:</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: styles.primary }}>0</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetectedViolations = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [violations, setViolations] = useState([
    { id: 1, frame: 'Frame 245', plate: 'MH12XY7890', type: 'helmet', location: 'MG Road Junction', timestamp: '2025-11-02 14:30:45', status: 'Detected' },
    { id: 2, frame: 'Frame 512', plate: 'DL08AB1234', type: 'red_light', location: 'FC Road Signal', timestamp: '2025-11-02 14:31:12', status: 'Detected' },
    { id: 3, frame: 'Frame 789', plate: 'MH14CD5678', type: 'triple_riding', location: 'Baner Chowk', timestamp: '2025-11-02 14:32:05', status: 'Detected' }
  ]);
  
  const handleAction = (id, action) => {
    setViolations(prev => prev.map(v => 
      v.id === id ? { ...v, status: action === 'generate' ? 'Challan Generated' : 'Rejected' } : v
    ));
  };
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Detected Violations</h2>
      
      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Frame</th>
                <th style={styles.th}>Vehicle Plate</th>
                <th style={styles.th}>Violation Type</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Timestamp</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {violations.map(v => (
                <tr key={v.id}>
                  <td style={styles.td}>
                    <div style={{
                      width: '80px',
                      height: '50px',
                      background: styles.light,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: styles.textSecondary
                    }}>
                      {v.frame}
                    </div>
                  </td>
                  <td style={styles.td}>{v.plate}</td>
                  <td style={styles.td}>
                    <span style={{ textTransform: 'capitalize' }}>{v.type.replace('_', ' ')}</span>
                  </td>
                  <td style={styles.td}>{v.location}</td>
                  <td style={styles.td}>{v.timestamp}</td>
                  <td style={styles.td}><StatusBadge status={v.status} /></td>
                  <td style={styles.td}>
                    {v.status === 'Detected' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleAction(v.id, 'generate')}
                          style={{
                            ...styles.button,
                            background: styles.success,
                            color: 'white',
                            padding: '6px 12px',
                            fontSize: '12px'
                          }}
                        >
                          Generate
                        </button>
                        <button
                          onClick={() => handleAction(v.id, 'reject')}
                          style={{
                            ...styles.button,
                            background: styles.error,
                            color: 'white',
                            padding: '6px 12px',
                            fontSize: '12px'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button style={{
            ...styles.button,
            background: styles.primary,
            color: 'white'
          }}>
            Submit All Approved
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateChallanStatus = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  
  const filteredChallans = mockViolations.filter(v => 
    v.challanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleStatusChange = (challanId, action) => {
    setSelectedAction({ challanId, action });
    setShowConfirm(true);
  };
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Update Challan Status</h2>
      
      <div style={styles.card}>
        <input
          type="text"
          placeholder="Search by Challan ID or Vehicle Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...styles.input, marginBottom: '20px' }}
        />
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Challan ID</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Violation</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredChallans.map(challan => (
                <tr key={challan.challanId}>
                  <td style={styles.td}>{challan.challanId}</td>
                  <td style={styles.td}>{challan.vehicleNumber}</td>
                  <td style={styles.td}>
                    <span style={{ textTransform: 'capitalize' }}>{challan.violationType.replace('_', ' ')}</span>
                  </td>
                  <td style={styles.td}>₹{challan.fineAmount}</td>
                  <td style={styles.td}><StatusBadge status={challan.status} /></td>
                  <td style={styles.td}>
                    <select
                      onChange={(e) => handleStatusChange(challan.challanId, e.target.value)}
                      style={{
                        ...styles.input,
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Action</option>
                      <option value="paid">Mark as Paid</option>
                      <option value="escalated">Mark as Escalated</option>
                      <option value="cancelled">Cancel Challan</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Action">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div style={{ fontSize: '16px', color: styles.text, marginBottom: '24px' }}>
            Are you sure you want to update the status of challan {selectedAction?.challanId}?
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                alert('Status updated successfully!');
                setShowConfirm(false);
              }}
              style={{
                ...styles.button,
                flex: 1,
                background: styles.primary,
                color: 'white'
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                ...styles.button,
                flex: 1,
                background: styles.light,
                color: styles.text
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ==================== ADMIN PAGES ====================

const AdminDashboard = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const totalRevenue = fineDistribution.reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = fineDistribution.find(f => f.category === 'Pending')?.amount || 0;
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Violations" value={violationStats.thisMonth} icon="🚦" color="#2563EB" />
        <StatCard title="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} icon="💰" color="#10B981" />
        <StatCard title="Pending Payments" value={`₹${(pendingAmount / 1000).toFixed(0)}K`} icon="⏳" color="#F59E0B" />
        <StatCard title="Active Officers" value="12" icon="👮" color="#8B5CF6" />
        <StatCard title="Top Location" value="MG Road" icon="📍" color="#EF4444" subtitle="45 violations" />
        <StatCard title="This Month" value="+642" icon="📈" color="#06B6D4" subtitle="violations" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Violations Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={violationsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke={styles.border} />
              <XAxis dataKey="date" stroke={styles.textSecondary} />
              <YAxis stroke={styles.textSecondary} />
              <Tooltip contentStyle={{ background: styles.cardBg, border: `1px solid ${styles.border}` }} />
              <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Fine Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fineDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.category}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
              >
                {fineDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: styles.cardBg, border: `1px solid ${styles.border}` }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Violation Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationStats.byType}>
              <CartesianGrid strokeDasharray="3 3" stroke={styles.border} />
              <XAxis dataKey="type" stroke={styles.textSecondary} />
              <YAxis stroke={styles.textSecondary} />
              <Tooltip contentStyle={{ background: styles.cardBg, border: `1px solid ${styles.border}` }} />
              <Bar dataKey="count" fill="#F97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Payment Trends (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={paymentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={styles.border} />
              <XAxis dataKey="month" stroke={styles.textSecondary} />
              <YAxis stroke={styles.textSecondary} />
              <Tooltip contentStyle={{ background: styles.cardBg, border: `1px solid ${styles.border}` }} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [showModal, setShowModal] = useState(false);
  const [officers, setOfficers] = useState([
    { id: 1, officerId: 'POL001', name: 'Rajesh Kumar', username: 'officer_raj', status: 'Active' },
    { id: 2, officerId: 'POL002', name: 'Priya Sharma', username: 'officer_priya', status: 'Active' },
    { id: 3, officerId: 'POL003', name: 'Amit Patel', username: 'officer_amit', status: 'Inactive' }
  ]);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700' }}>User Management</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            ...styles.button,
            background: styles.primary,
            color: 'white'
          }}
        >
          ➕ Add New Officer
        </button>
      </div>
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Officer ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {officers.map(officer => (
              <tr key={officer.id}>
                <td style={styles.td}>{officer.officerId}</td>
                <td style={styles.td}>{officer.name}</td>
                <td style={styles.td}>{officer.username}</td>
                <td style={styles.td}>
                  <StatusBadge status={officer.status} />
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      ...styles.button,
                      background: styles.primary,
                      color: 'white',
                      padding: '6px 12px',
                      fontSize: '12px'
                    }}>
                      ✏️ Edit
                    </button>
                    <button style={{
                      ...styles.button,
                      background: styles.error,
                      color: 'white',
                      padding: '6px 12px',
                      fontSize: '12px'
                    }}>
                      🗑️ Delete
                    </button>
                    <button style={{
                      ...styles.button,
                      background: styles.warning,
                      color: 'white',
                      padding: '6px 12px',
                      fontSize: '12px'
                    }}>
                      🔄 Reset
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Officer">
        <form onSubmit={(e) => {
          e.preventDefault();
          alert('Officer added successfully!');
          setShowModal(false);
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Name</label>
            <input type="text" required style={styles.input} placeholder="Enter officer name" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Username</label>
            <input type="text" required style={styles.input} placeholder="Enter username" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Password</label>
            <input type="password" required style={styles.input} placeholder="Enter password" />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Officer ID</label>
            <input type="text" required style={styles.input} placeholder="e.g., POL004" />
          </div>
          <button type="submit" style={{
            ...styles.button,
            width: '100%',
            background: styles.primary,
            color: 'white'
          }}>
            Add Officer
          </button>
        </form>
      </Modal>
    </div>
  );
};

const ViolationManagement = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  
  const filteredViolations = mockViolations.filter(v => {
    const matchesSearch = v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.challanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesType = typeFilter === 'All' || v.violationType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Violation Management</h2>
      
      <div style={styles.card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by Vehicle/Challan ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.input}>
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={styles.input}>
            <option value="All">All Types</option>
            <option value="helmet">Helmet</option>
            <option value="red_light">Red Light</option>
            <option value="triple_riding">Triple Riding</option>
            <option value="speeding">Speeding</option>
          </select>
          <button style={{
            ...styles.button,
            background: styles.success,
            color: 'white'
          }}>
            📥 Export CSV
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Challan ID</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map(v => (
                <tr key={v.challanId}>
                  <td style={styles.td}>{v.challanId}</td>
                  <td style={styles.td}>{v.vehicleNumber}</td>
                  <td style={styles.td}>
                    <span style={{ textTransform: 'capitalize' }}>{v.violationType.replace('_', ' ')}</span>
                  </td>
                  <td style={styles.td}>{new Date(v.timestamp).toLocaleDateString()}</td>
                  <td style={styles.td}>{v.location}</td>
                  <td style={styles.td}>₹{v.fineAmount}</td>
                  <td style={styles.td}><StatusBadge status={v.status} /></td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        ...styles.button,
                        background: styles.primary,
                        color: 'white',
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}>
                        👁️ View
                      </button>
                      <button style={{
                        ...styles.button,
                        background: styles.warning,
                        color: 'white',
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}>
                        ✏️ Edit
                      </button>
                      <button style={{
                        ...styles.button,
                        background: styles.error,
                        color: 'white',
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PaymentOverview = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const totalCollected = fineDistribution.find(f => f.category === 'Paid')?.amount || 0;
  const pendingAmount = fineDistribution.find(f => f.category === 'Pending')?.amount || 0;
  const thisMonth = paymentTrends[paymentTrends.length - 1]?.revenue || 0;
  const successRate = ((totalCollected / (totalCollected + pendingAmount)) * 100).toFixed(1);
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Payment Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Collected" value={`₹${(totalCollected / 1000).toFixed(0)}K`} icon="💰" color="#10B981" />
        <StatCard title="Pending Amount" value={`₹${(pendingAmount / 1000).toFixed(0)}K`} icon="⏳" color="#F59E0B" />
        <StatCard title="This Month Revenue" value={`₹${(thisMonth / 1000).toFixed(0)}K`} icon="📊" color="#2563EB" />
        <StatCard title="Success Rate" value={`${successRate}%`} icon="✓" color="#8B5CF6" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Monthly Revenue (6 Months)</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: styles.light, borderRadius: '8px' }}>
            <div style={{ textAlign: 'center', color: styles.textSecondary }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
              <div>Monthly Revenue Chart</div>
            </div>
          </div>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Payment Status</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: styles.light, borderRadius: '8px' }}>
            <div style={{ textAlign: 'center', color: styles.textSecondary }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍰</div>
              <div>Payment Status Chart</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Download Reports</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <button style={{
            ...styles.button,
            background: styles.primary,
            color: 'white'
          }}>
            📄 Monthly Report
          </button>
          <button style={{
            ...styles.button,
            background: styles.secondary,
            color: 'white'
          }}>
            📊 Quarterly Report
          </button>
          <button style={{
            ...styles.button,
            background: styles.success,
            color: 'white'
          }}>
            📈 Annual Report
          </button>
        </div>
      </div>
    </div>
  );
};

const LocationAnalytics = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Location Analytics</h2>
      
      <div style={{ ...styles.card, marginBottom: '24px' }}>
        <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Top Violation Locations Map</h3>
        <div style={{
          padding: '80px',
          background: styles.light,
          borderRadius: '12px',
          textAlign: 'center',
          color: styles.textSecondary
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗺️</div>
          <div style={{ fontSize: '18px', fontWeight: '500' }}>Interactive Location Heatmap</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>Visualization of high-violation zones</div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Top 5 Locations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topLocations.map((loc, index) => (
              <div key={index} style={{
                padding: '16px',
                background: styles.light,
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>
                    {index + 1}. {loc.location}
                  </div>
                  <div style={{ fontSize: '12px', color: styles.textSecondary, marginTop: '4px' }}>
                    High violation area
                  </div>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: styles.primary
                }}>
                  {loc.violations}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Violations by Location</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: styles.light, borderRadius: '8px' }}>
            <div style={{ textAlign: 'center', color: styles.textSecondary }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
              <div>Violations by Location Chart</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Accident-Prone Zones</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {['MG Road Junction', 'FC Road Signal', 'Baner Chowk'].map((zone, index) => (
            <div key={index} style={{
              padding: '12px 20px',
              background: '#FEE2E2',
              color: '#991B1B',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🚨</span>
              <span>{zone}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div style={{ ...styles.card, marginTop: '24px' }}>
      <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📱 Notification Settings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { label: 'SMS Notifications for New Challans', checked: true },
          { label: 'Email Alerts for Payment Due', checked: true },
          { label: 'Push Notifications', checked: false },
          { label: 'Weekly Violation Summary', checked: true }
        ].map((setting, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: styles.light,
            borderRadius: '8px'
          }}>
            <div style={{ color: styles.text, fontWeight: '500' }}>{setting.label}</div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input type="checkbox" defaultChecked={setting.checked} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: setting.checked ? styles.success : styles.textSecondary,
                borderRadius: '24px',
                transition: '0.4s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '',
                  height: '18px',
                  width: '18px',
                  left: setting.checked ? '28px' : '3px',
                  bottom: '3px',
                  background: 'white',
                  borderRadius: '50%',
                  transition: '0.4s'
                }}></span>
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemSettings = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [fineAmounts, setFineAmounts] = useState({
    helmet: 1000,
    red_light: 5000,
    triple_riding: 2000,
    speeding: 3000,
    wrong_parking: 500
  });
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>System Settings</h2>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Fine Amounts Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(fineAmounts).map(([key, value]) => (
            <div key={key}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', textTransform: 'capitalize' }}>
                {key.replace('_', ' ')}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setFineAmounts({ ...fineAmounts, [key]: parseInt(e.target.value) })}
                style={styles.input}
              />
            </div>
          ))}
        </div>
        <button style={{
          ...styles.button,
          background: styles.primary,
          color: 'white'
        }}>
          💾 Update Fine Amounts
        </button>
      </div>
      
      <div style={{ ...styles.card, marginTop: '24px' }}>
        <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>System Thresholds</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Speed Limit (km/h)</label>
            <input type="number" defaultValue="80" style={styles.input} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Helmet Detection Confidence (%)</label>
            <input type="number" defaultValue="85" style={styles.input} />
          </div>
        </div>
      </div>
      
      <div style={{ ...styles.card, marginTop: '24px' }}>
        <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Feature Toggles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Auto-Challan Generation', checked: true },
            { label: 'SMS Notifications', checked: true },
            { label: 'Email Alerts', checked: false },
            { label: 'Real-time Detection', checked: true }
          ].map((toggle, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: styles.light,
              borderRadius: '8px'
            }}>
              <div style={{ color: styles.text, fontWeight: '500' }}>{toggle.label}</div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                <input type="checkbox" defaultChecked={toggle.checked} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: toggle.checked ? styles.success : styles.textSecondary,
                  borderRadius: '24px',
                  transition: '0.4s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '18px',
                    width: '18px',
                    left: toggle.checked ? '28px' : '3px',
                    bottom: '3px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: '0.4s'
                  }}></span>
                </span>
              </label>
            </div>
          ))}
        </div>
        <button style={{
          ...styles.button,
          background: styles.primary,
          color: 'white',
          marginTop: '24px'
        }}>
          💾 Save Settings
        </button>
      </div>
      
      <NotificationSettings />
    </div>
  );
};

// ==================== LAYOUT ====================

const DashboardLayout = ({ children }) => {
  const { user, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div style={{ background: styles.background, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ 
        display: 'flex',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row'
      }}>
        <Sidebar role={user?.role} />
        <div style={{ 
          flex: 1, 
          padding: window.innerWidth < 768 ? '16px 12px 80px 12px' : '24px', 
          overflowY: 'auto' 
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Help & Support Component
const HelpSupport = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Help & Support</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>📞 Contact Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ color: styles.text }}>📧 Email: support@yatayat.gov.in</div>
            <div style={{ color: styles.text }}>📱 Phone: +91-1800-123-4567</div>
            <div style={{ color: styles.text }}>🕒 Hours: 24/7 Support</div>
          </div>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>❓ FAQ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ color: styles.text, fontSize: '14px' }}>• How to pay challan online?</div>
            <div style={{ color: styles.text, fontSize: '14px' }}>• How to check vehicle violations?</div>
            <div style={{ color: styles.text, fontSize: '14px' }}>• How to download receipt?</div>
            <div style={{ color: styles.text, fontSize: '14px' }}>• How to dispute a challan?</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const { user } = useAuth();
  
  const renderPage = () => {
    console.log('Rendering page:', { user: user?.username, currentPage });
    
    if (!user) {
      console.log('No user, showing login page');
      return <LoginPage onLogin={() => {
        console.log('Login callback triggered');
        setCurrentPage('dashboard');
      }} />;
    }
    
    console.log('User logged in, showing dashboard for role:', user.role);
    switch(currentPage) {
      case 'dashboard':
        if (user.role === 'citizen') return <DashboardLayout><CitizenDashboard /></DashboardLayout>;
        if (user.role === 'police') return <DashboardLayout><PoliceDashboard /></DashboardLayout>;
        if (user.role === 'admin') return <DashboardLayout><AdminDashboard /></DashboardLayout>;
        break;
      case 'challans':
        return <DashboardLayout><CitizenChallans /></DashboardLayout>;
      case 'lookup':
        return <DashboardLayout><VehicleLookup /></DashboardLayout>;
      default:
        return <DashboardLayout><CitizenDashboard /></DashboardLayout>;
    }
  };
  
  return <div>{renderPage()}</div>;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));