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