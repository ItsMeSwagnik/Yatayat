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