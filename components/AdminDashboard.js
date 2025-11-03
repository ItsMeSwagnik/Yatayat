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