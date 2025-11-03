const PaymentOverview = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const totalRevenue = fineDistribution.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = fineDistribution.find(f => f.category === 'Paid')?.amount || 0;
  const pendingAmount = fineDistribution.find(f => f.category === 'Pending')?.amount || 0;
  
  const recentPayments = [
    { id: 'PAY001', challanId: 'CH002', amount: 5000, method: 'UPI', status: 'Completed', date: '2025-11-02', vehicleNumber: 'MH12AB1234' },
    { id: 'PAY002', challanId: 'CH005', amount: 3000, method: 'Card', status: 'Completed', date: '2025-11-01', vehicleNumber: 'MH12AB1234' },
    { id: 'PAY003', challanId: 'CH001', amount: 1000, method: 'Net Banking', status: 'Pending', date: '2025-11-02', vehicleNumber: 'MH12AB1234' }
  ];
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Payment Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} icon="💰" color="#10B981" />
        <StatCard title="Collected" value={`₹${(paidAmount / 1000).toFixed(0)}K`} icon="✅" color="#2563EB" />
        <StatCard title="Pending" value={`₹${(pendingAmount / 1000).toFixed(0)}K`} icon="⏳" color="#F59E0B" />
        <StatCard title="Collection Rate" value="72%" icon="📊" color="#8B5CF6" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Revenue Trends (6 Months)</h3>
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
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Payment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={fineDistribution} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.category} (${entry.percentage}%)`} outerRadius={100} fill="#8884d8" dataKey="percentage">
                {fineDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: styles.cardBg, border: `1px solid ${styles.border}` }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Recent Payments</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Payment ID</th>
                <th style={styles.th}>Challan ID</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map(payment => (
                <tr key={payment.id}>
                  <td style={styles.td}>{payment.id}</td>
                  <td style={styles.td}>{payment.challanId}</td>
                  <td style={styles.td}>{payment.vehicleNumber}</td>
                  <td style={styles.td}>₹{payment.amount}</td>
                  <td style={styles.td}>{payment.method}</td>
                  <td style={styles.td}>{payment.date}</td>
                  <td style={styles.td}><StatusBadge status={payment.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};