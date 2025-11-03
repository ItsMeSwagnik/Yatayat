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