const { useState, useEffect, useRef, createContext, useContext, useMemo } = React;
const { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts || {};

// ==================== MOCK DATA ====================

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password, role) => {
    console.log('Login attempt:', { email, role });
    
    try {
      const response = await fetch(window.location.origin.includes('localhost') ? 'http://localhost:5000/api/login' : '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Login successful:', data.user.email);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        console.log('Login failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const googleLogin = async (credential, role) => {
    try {
      const response = await fetch(window.location.origin.includes('localhost') ? 'http://localhost:5000/api/google-auth' : '/api/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, role })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    console.log('User logged out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout, darkMode, toggleDarkMode, notifications, markNotificationRead }}>
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
            <span>{user?.fullName || user?.email}</span>
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
                <div style={{ fontWeight: '600', color: styles.text }}>{user?.fullName || user?.email}</div>
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
const Sidebar = ({ role, currentPage, onPageChange }) => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const menuItems = {
    citizen: [
      { path: 'dashboard', icon: '🏠', label: 'Dashboard' },
      { path: 'profile', icon: '👤', label: 'Profile & Settings' },
      { path: 'challans', icon: '📋', label: 'My Challans' },
      { path: 'lookup', icon: '🔍', label: 'Vehicle Lookup' },
      { path: 'history', icon: '📊', label: 'Violation History' },
      { path: 'help', icon: '❓', label: 'Help & Support' }
    ],
    police: [
      { path: 'dashboard', icon: '🏠', label: 'Dashboard' },
      { path: 'record', icon: '🎥', label: 'Record Violation' },
      { path: 'detected', icon: '📸', label: 'Detected Violations' },
      { path: 'update', icon: '✏️', label: 'Update Challan' },
      { path: 'help', icon: '❓', label: 'Help & Support' }
    ],
    admin: [
      { path: 'dashboard', icon: '🏠', label: 'Dashboard' },
      { path: 'users', icon: '👥', label: 'User Management' },
      { path: 'violations', icon: '🚦', label: 'Violation Management' },
      { path: 'payments', icon: '💰', label: 'Payment Overview' },
      { path: 'analytics', icon: '📍', label: 'Location Analytics' },
      { path: 'settings', icon: '⚙️', label: 'System Settings' },
      { path: 'help', icon: '❓', label: 'Help & Support' }
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
          onClick={() => onPageChange(item.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            cursor: 'pointer',
            color: styles.text,
            background: currentPage === item.path ? styles.light : 'transparent',
            borderLeft: currentPage === item.path ? `3px solid ${styles.primary}` : '3px solid transparent',
            fontWeight: currentPage === item.path ? '600' : '400',
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

// Firebase Google Sign-In Button Component
const GoogleSignInButton = ({ role }) => {
  const { googleLogin, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Initialize Firebase
    if (window.firebase && !window.firebase.apps.length) {
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
      };
      window.firebase.initializeApp(firebaseConfig);
    }
  }, []);
  
  const handleGoogleLogin = async () => {
    // Security check: Prevent admin login via Google
    if (role === 'admin') {
      alert('Admin login is not allowed through Google authentication for security reasons. Please use email/password login.');
      return;
    }
    
    if (!window.firebase) {
      alert('Firebase not loaded. Please refresh and try again.');
      return;
    }
    
    setLoading(true);
    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      const result = await window.firebase.auth().signInWithPopup(provider);
      const user = result.user;
      
      // Get ID token
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: idToken, role })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        alert(data.message || 'Google login failed');
      }

    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      style={{
        ...styles.button,
        width: '100%',
        background: 'white',
        color: '#1f2937',
        border: `1px solid ${styles.border}`,
        fontWeight: '500',
        fontSize: '16px',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
    >
      {loading ? (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid #1f2937',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
};

// ==================== LOGIN PAGE ====================
const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const [vehicleNumbers, setVehicleNumbers] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);
  const { login, googleLogin, darkMode, toggleDarkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMounted.current) return;
    
    console.log('Form submitted:', { isLogin, email, role });
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const result = await login(email, password, role);
        if (!isMounted.current) return;
        
        if (result.success) {
          console.log('Redirecting to dashboard');
          onLogin && onLogin();
        } else {
          console.log('Setting error message:', result.message);
          setError(result.message || 'Invalid credentials. Please try again.');
        }
      } else {
        if (password !== confirmPassword) {
          console.log('Password mismatch');
          setError('Passwords do not match');
          return;
        }
        
        const response = await fetch(window.location.origin.includes('localhost') ? 'http://localhost:5000/api/register' : '/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            role,
            fullName,
            vehicleNumbers: role === 'citizen' ? vehicleNumbers.split(',').map(v => v.trim()) : undefined,
            officerId: role === 'police' ? `POL${Date.now().toString().slice(-3)}` : undefined
          })
        });
        
        if (!isMounted.current) return;
        
        const data = await response.json();
        
        if (response.ok) {
          setError('Registration successful! Please login.');
          setIsLogin(true);
        } else {
          setError(data.message);
        }
      }
    } catch (error) {
      if (isMounted.current) {
        if (isLogin) {
          setError('Login failed. Please try again.');
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
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
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', fontSize: '14px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
              placeholder="Enter email address"
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
              {isLogin && <option value="admin">Admin</option>}
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
          
          {!isLogin && role === 'police' && (
            <div style={{
              padding: '12px',
              background: '#FEF3C7',
              color: '#92400E',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              ⚠️ Police accounts require admin verification before login access is granted.
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
            disabled={loading}
            style={{
              ...styles.button,
              width: '100%',
              background: loading ? styles.border : styles.primary,
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              padding: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            )}
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
          
          {isLogin && role !== 'admin' && (
            <>
              <div style={{ textAlign: 'center', margin: '20px 0', color: styles.textSecondary, fontSize: '14px' }}>
                or
              </div>
              <GoogleSignInButton role={role} />
            </>
          )}
          
          {isLogin && role === 'admin' && (
            <div style={{
              padding: '12px',
              background: '#FEF3C7',
              color: '#92400E',
              borderRadius: '8px',
              marginTop: '16px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              🔒 Admin accounts can only login with email/password for security reasons.
            </div>
          )}
          
          {isLogin && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a href="#" style={{ color: styles.primary, fontSize: '14px', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
          )}
        </form>
        

      </div>
    </div>
  );
};

// ==================== ADMIN PAGES ====================

// User Management Component
const UserManagement = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const response = await fetch(window.location.origin.includes('localhost') ? 'http://localhost:5000/api/users' : '/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });
  
  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const user = users.find(u => u._id === id);
      let newStatus;
      
      if (user.role === 'police' && currentStatus === 'Pending') {
        newStatus = 'Active';
      } else {
        newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      }
      
      const response = await fetch(`${window.location.origin.includes('localhost') ? 'http://localhost:5000' : ''}/api/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user._id === id ? { ...user, status: newStatus } : user
        ));
        
        if (user.role === 'police' && currentStatus === 'Pending') {
          alert('Police account verified successfully!');
        } else {
          alert(`User ${newStatus.toLowerCase()} successfully!`);
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status');
    }
  };
  
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };
  
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${window.location.origin.includes('localhost') ? 'http://localhost:5000' : ''}/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setUsers(prev => prev.filter(user => user._id !== id));
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };
  
  if (loading) {
    return (
      <div>
        <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>User Management</h2>
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>User Management</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Users" value={users.length} icon="👥" color="#2563EB" />
        <StatCard title="Active Users" value={users.filter(u => u.status === 'Active').length} icon="✅" color="#10B981" />
        <StatCard title="Police Officers" value={users.filter(u => u.role === 'police').length} icon="👮" color="#F59E0B" />
        <StatCard title="Pending Verification" value={users.filter(u => u.status === 'Pending').length} icon="⏳" color="#EF4444" />
      </div>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', flex: 1, minWidth: '300px' }}>
            <SearchBar placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ ...styles.input, width: 'auto', minWidth: '120px' }}>
              <option value="All">All Roles</option>
              <option value="citizen">Citizens</option>
              <option value="police">Police</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={styles.td}>{user.fullName}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}><span style={{ textTransform: 'capitalize', padding: '4px 8px', background: styles.light, borderRadius: '4px' }}>{user.role}</span></td>
                  <td style={styles.td}><StatusBadge status={user.status} /></td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => toggleUserStatus(user._id, user.status)} 
                        style={{ 
                          ...styles.button, 
                          background: user.role === 'police' && user.status === 'Pending' ? styles.success : (user.status === 'Active' ? styles.warning : styles.success), 
                          color: 'white', 
                          padding: '8px 12px', 
                          fontSize: '12px',
                          minWidth: '80px'
                        }}
                      >
                        {user.role === 'police' && user.status === 'Pending' ? 'Verify' : (user.status === 'Active' ? 'Deactivate' : 'Activate')}
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        style={{ 
                          ...styles.button, 
                          background: styles.primary, 
                          color: 'white', 
                          padding: '8px 12px', 
                          fontSize: '12px',
                          minWidth: '60px'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(user)}
                        style={{ 
                          ...styles.button, 
                          background: styles.error, 
                          color: 'white', 
                          padding: '8px 12px', 
                          fontSize: '12px',
                          minWidth: '60px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: styles.textSecondary }}>
            No users found
          </div>
        )}
      </div>
      
      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
        {editingUser && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const userData = {
              fullName: formData.get('fullName'),
              email: formData.get('email'),
              role: formData.get('role')
            };
            if (formData.get('role') === 'citizen') {
              userData.vehicleNumbers = formData.get('vehicleNumbers')?.split(',').map(v => v.trim()) || [];
            }
            
            setUsers(prev => prev.map(user => 
              user._id === editingUser._id ? { ...user, ...userData } : user
            ));
            setShowEditModal(false);
            alert('User updated successfully!');
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Full Name</label>
              <input name="fullName" type="text" defaultValue={editingUser.fullName} required style={styles.input} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Email</label>
              <input name="email" type="email" defaultValue={editingUser.email} required style={styles.input} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Role</label>
              <select name="role" defaultValue={editingUser.role} required style={styles.input}>
                <option value="citizen">Citizen</option>
                <option value="police">Police Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {editingUser.role === 'citizen' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Vehicle Numbers</label>
                <input name="vehicleNumbers" type="text" defaultValue={editingUser.vehicleNumbers?.join(', ')} style={styles.input} placeholder="e.g., MH12AB1234, MH14CD5678" />
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" style={{ ...styles.button, flex: 1, background: styles.primary, color: 'white' }}>Update User</button>
              <button type="button" onClick={() => setShowEditModal(false)} style={{ ...styles.button, flex: 1, background: styles.light, color: styles.text }}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: styles.text, marginBottom: '8px' }}>
            Delete User
          </div>
          <div style={{ fontSize: '14px', color: styles.textSecondary, marginBottom: '24px' }}>
            Are you sure you want to delete <strong>{userToDelete?.fullName}</strong>? This action cannot be undone.
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => deleteUser(userToDelete?._id)}
              style={{
                ...styles.button,
                background: styles.error,
                color: 'white',
                padding: '12px 24px'
              }}
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                ...styles.button,
                background: styles.light,
                color: styles.text,
                padding: '12px 24px'
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

// Admin components are loaded from separate files

// All components are loaded from separate files

// ==================== LAYOUT ====================

const DashboardLayout = ({ children, currentPage, onPageChange }) => {
  const { user, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  return (
    <div style={{ background: styles.background, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ 
        display: 'flex',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row'
      }}>
        <Sidebar role={user?.role} currentPage={currentPage} onPageChange={onPageChange} />
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



// ==================== MAIN APP ====================

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const { user } = useAuth();
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const renderPageContent = () => {
    if (user?.role === 'citizen') {
      switch(currentPage) {
        case 'dashboard': return <CitizenDashboard />;
        case 'profile': return <CitizenProfile />;
        case 'challans': return <CitizenChallans />;
        case 'lookup': return <VehicleLookup />;
        case 'history': return <ViolationHistory />;
        case 'help': return <HelpSupport />;
        default: return <CitizenDashboard />;
      }
    }
    
    if (user?.role === 'police') {
      switch(currentPage) {
        case 'dashboard': return <PoliceDashboard />;
        case 'record': return <RecordViolation />;
        case 'detected': return <DetectedViolations />;
        case 'update': return <UpdateChallanStatus />;
        case 'help': return <HelpSupport />;
        default: return <PoliceDashboard />;
      }
    }
    
    if (user?.role === 'admin') {
      switch(currentPage) {
        case 'dashboard': return <AdminDashboard />;
        case 'users': return <UserManagement />;
        case 'violations': return <ViolationManagement />;
        case 'payments': return <PaymentOverview />;
        case 'analytics': return <LocationAnalytics />;
        case 'settings': return <SystemSettings />;
        case 'help': return <AdminHelpSupport />;
        default: return <AdminDashboard />;
      }
    }
    
    return <div>Page not found</div>;
  };
  
  const renderPage = () => {
    if (!user) {
      return <LoginPage onLogin={() => setCurrentPage('dashboard')} />;
    }
    
    return (
      <DashboardLayout currentPage={currentPage} onPageChange={handlePageChange}>
        {renderPageContent()}
      </DashboardLayout>
    );
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