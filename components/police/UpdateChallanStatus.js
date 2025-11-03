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
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
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
                      <button
                        onClick={() => generateChallanPDF(challan)}
                        style={{
                          ...styles.button,
                          background: styles.success,
                          color: 'white',
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                      >
                        Download PDF
                      </button>
                    </div>
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