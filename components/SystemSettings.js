const SystemSettings = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [fineAmounts, setFineAmounts] = useState({
    helmet: 1000,
    red_light: 5000,
    triple_riding: 2000,
    speeding: 3000
  });
  const [systemConfig, setSystemConfig] = useState({
    autoDetection: true,
    emailNotifications: true,
    smsAlerts: false,
    paymentReminders: true
  });
  
  const handleFineUpdate = (type, amount) => {
    setFineAmounts(prev => ({ ...prev, [type]: parseInt(amount) }));
  };
  
  const handleConfigUpdate = (key, value) => {
    setSystemConfig(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>System Settings</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Fine Amount Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {Object.entries(fineAmounts).map(([type, amount]) => (
              <div key={type}>
                <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500', textTransform: 'capitalize' }}>
                  {type.replace('_', ' ')} Violation
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: styles.text }}>₹</span>
                  <input type="number" value={amount} onChange={(e) => handleFineUpdate(type, e.target.value)} style={{ ...styles.input, flex: 1 }} />
                </div>
              </div>
            ))}
          </div>
          <button style={{ ...styles.button, background: styles.primary, color: 'white', marginTop: '16px' }}>Save Fine Settings</button>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>System Configuration</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {Object.entries(systemConfig).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: styles.light, borderRadius: '8px' }}>
                <div>
                  <div style={{ color: styles.text, fontWeight: '500', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div style={{ fontSize: '12px', color: styles.textSecondary }}>Enable/disable {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input type="checkbox" checked={value} onChange={(e) => handleConfigUpdate(key, e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: value ? styles.primary : '#ccc', borderRadius: '24px', transition: '0.4s' }}>
                    <span style={{ position: 'absolute', content: '', height: '18px', width: '18px', left: value ? '26px' : '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '0.4s' }}></span>
                  </span>
                </label>
              </div>
            ))}
          </div>
          <button style={{ ...styles.button, background: styles.primary, color: 'white', marginTop: '16px' }}>Save Configuration</button>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>System Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '12px', background: styles.light, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>System Version</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: styles.text }}>v2.1.0</div>
            </div>
            <div style={{ padding: '12px', background: styles.light, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Database Status</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: styles.success }}>Connected</div>
            </div>
            <div style={{ padding: '12px', background: styles.light, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Last Backup</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: styles.text }}>2 hours ago</div>
            </div>
            <div style={{ padding: '12px', background: styles.light, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Active Sessions</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: styles.text }}>24</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};