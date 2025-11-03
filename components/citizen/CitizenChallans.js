const CitizenChallans = () => {
  const { user, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const userChallans = mockViolations.filter(v => 
    user?.vehicleNumbers?.includes(v.vehicleNumber)
  );
  
  const filteredChallans = userChallans.filter(c => {
    const matchesSearch = c.challanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>My Challans</h2>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <SearchBar
            placeholder="Search by Challan ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ ...styles.input, width: 'auto', minWidth: '150px' }}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
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
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Location</th>
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
                  <td style={styles.td}>{new Date(challan.timestamp).toLocaleDateString()}</td>
                  <td style={styles.td}>{challan.location}</td>
                  <td style={styles.td}>₹{challan.fineAmount}</td>
                  <td style={styles.td}><StatusBadge status={challan.status} /></td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedChallan(challan)}
                        style={{
                          ...styles.button,
                          background: styles.primary,
                          color: 'white',
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                      >
                        View
                      </button>
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
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredChallans.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: styles.textSecondary }}>
            No challans found
          </div>
        )}
      </div>
      
      <Modal isOpen={!!selectedChallan} onClose={() => setSelectedChallan(null)} title="Challan Details">
        {selectedChallan && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Challan ID</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: styles.text }}>{selectedChallan.challanId}</div>
            </div>
            <StatusBadge status={selectedChallan.status} />
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Fine Amount</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: styles.error }}>₹{selectedChallan.fineAmount}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};