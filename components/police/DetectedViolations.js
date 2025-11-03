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