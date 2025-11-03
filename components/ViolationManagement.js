const ViolationManagement = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [violations, setViolations] = useState(mockViolations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedViolation, setSelectedViolation] = useState(null);
  
  const filteredViolations = violations.filter(v => {
    const matchesSearch = v.challanId.toLowerCase().includes(searchTerm.toLowerCase()) || v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const updateViolationStatus = (id, newStatus) => {
    setViolations(prev => prev.map(v => v.challanId === id ? { ...v, status: newStatus } : v));
  };
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Violation Management</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Violations" value={violations.length} icon="🚦" color="#2563EB" />
        <StatCard title="Pending" value={violations.filter(v => v.status === 'Pending').length} icon="⏳" color="#F59E0B" />
        <StatCard title="Paid" value={violations.filter(v => v.status === 'Paid').length} icon="✅" color="#10B981" />
        <StatCard title="Cancelled" value={violations.filter(v => v.status === 'Cancelled').length} icon="❌" color="#EF4444" />
      </div>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <SearchBar placeholder="Search by Challan ID or Vehicle Number" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...styles.input, width: 'auto', minWidth: '150px' }}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Challan ID</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Violation Type</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map(violation => (
                <tr key={violation.challanId}>
                  <td style={styles.td}>{violation.challanId}</td>
                  <td style={styles.td}>{violation.vehicleNumber}</td>
                  <td style={styles.td}><span style={{ textTransform: 'capitalize' }}>{violation.violationType.replace('_', ' ')}</span></td>
                  <td style={styles.td}>{violation.location}</td>
                  <td style={styles.td}>{new Date(violation.timestamp).toLocaleDateString()}</td>
                  <td style={styles.td}>₹{violation.fineAmount}</td>
                  <td style={styles.td}><StatusBadge status={violation.status} /></td>
                  <td style={styles.td}>
                    <button onClick={() => setSelectedViolation(violation)} style={{ ...styles.button, background: styles.primary, color: 'white', padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}>View</button>
                    <select onChange={(e) => { if(e.target.value) updateViolationStatus(violation.challanId, e.target.value); e.target.value = ''; }} style={{ ...styles.input, padding: '6px', fontSize: '12px', width: 'auto' }}>
                      <option value="">Update Status</option>
                      <option value="Paid">Mark as Paid</option>
                      <option value="Cancelled">Cancel</option>
                      <option value="Pending">Mark as Pending</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={!!selectedViolation} onClose={() => setSelectedViolation(null)} title="Violation Details">
        {selectedViolation && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Challan ID</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: styles.text }}>{selectedViolation.challanId}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <StatusBadge status={selectedViolation.status} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Vehicle Number</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedViolation.vehicleNumber}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Violation Type</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text, textTransform: 'capitalize' }}>{selectedViolation.violationType.replace('_', ' ')}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Location</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedViolation.location}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Officer ID</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedViolation.officerId}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Fine Amount</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: styles.error }}>₹{selectedViolation.fineAmount}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};