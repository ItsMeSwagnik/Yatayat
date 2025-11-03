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