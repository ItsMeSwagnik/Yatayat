const CitizenDashboard = () => {
  const { user, darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const userChallans = mockViolations.filter(v => 
    user?.vehicleNumbers?.includes(v.vehicleNumber)
  );
  
  const pendingFines = userChallans.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.fineAmount, 0);
  const paidFines = userChallans.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.fineAmount, 0);
  const recentChallans = userChallans.slice(0, 5);
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
        Welcome, {user?.fullName || user?.email}!
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Vehicles" value={user?.vehicleNumbers?.length || 0} icon="🚗" color="#2563EB" />
        <StatCard title="Pending Fines" value={`₹${pendingFines}`} icon="⚠️" color="#F59E0B" />
        <StatCard title="Total Fines Paid" value={`₹${paidFines}`} icon="✓" color="#10B981" />
        <StatCard title="Total Challans" value={userChallans.length} icon="📋" color="#8B5CF6" />
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Recent Challans</h3>
        
        {recentChallans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: styles.textSecondary }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '18px', fontWeight: '500' }}>No Challans Found</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>You have a clean driving record!</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Challan ID</th>
                  <th style={styles.th}>Violation Type</th>
                  <th style={styles.th}>Date &amp; Time</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentChallans.map(challan => (
                  <tr key={challan.challanId} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = styles.light} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={styles.td}>{challan.challanId}</td>
                    <td style={styles.td}>
                      <span style={{ textTransform: 'capitalize' }}>{challan.violationType.replace('_', ' ')}</span>
                    </td>
                    <td style={styles.td}>{new Date(challan.timestamp).toLocaleString()}</td>
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
                          View Details
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
                          Download PDF
                        </button>
                      </div>
                      {challan.status === 'Pending' && (
                        <button
                          onClick={() => {
                            setSelectedChallan(challan);
                            setShowPaymentModal(true);
                          }}
                          style={{
                            ...styles.button,
                            background: styles.success,
                            color: 'white',
                            padding: '6px 12px',
                            fontSize: '12px',
                            marginLeft: '8px'
                          }}
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <DrivingTips />
      
      {/* Challan Details Modal */}
      <Modal isOpen={selectedChallan && !showPaymentModal} onClose={() => setSelectedChallan(null)} title="Challan Details">
        {selectedChallan && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Challan ID</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: styles.text }}>{selectedChallan.challanId}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <StatusBadge status={selectedChallan.status} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Vehicle Number</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedChallan.vehicleNumber}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Violation Type</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text, textTransform: 'capitalize' }}>
                {selectedChallan.violationType.replace('_', ' ')}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Date &amp; Time</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>
                {new Date(selectedChallan.timestamp).toLocaleString()}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Location</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedChallan.location}</div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary, marginBottom: '4px' }}>Fine Amount</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: styles.error }}>₹{selectedChallan.fineAmount}</div>
            </div>
            <div style={{
              padding: '16px',
              background: styles.light,
              borderRadius: '8px',
              textAlign: 'center',
              color: styles.textSecondary,
              marginBottom: '16px'
            }}>
              📷 Violation Image Placeholder
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => generateChallanPDF(selectedChallan)}
                style={{
                  ...styles.button,
                  flex: 1,
                  background: styles.primary,
                  color: 'white'
                }}
              >
                📄 Download Challan
              </button>
              {selectedChallan.status === 'Paid' && (
                <button style={{
                  ...styles.button,
                  flex: 1,
                  background: styles.success,
                  color: 'white'
                }}>
                  🧾 Download Receipt
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
      
      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Pay Challan">
        {selectedChallan && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: styles.textSecondary, marginBottom: '8px' }}>Challan ID: {selectedChallan.challanId}</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: styles.text }}>₹{selectedChallan.fineAmount}</div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: styles.text, marginBottom: '12px' }}>Select Payment Method</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button style={{
                  ...styles.button,
                  background: styles.light,
                  color: styles.text,
                  justifyContent: 'flex-start',
                  padding: '16px',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <span style={{ marginRight: '12px' }}>📱</span> UPI Payment
                </button>
                <button style={{
                  ...styles.button,
                  background: styles.light,
                  color: styles.text,
                  justifyContent: 'flex-start',
                  padding: '16px',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <span style={{ marginRight: '12px' }}>💳</span> Credit/Debit Card
                </button>
                <button style={{
                  ...styles.button,
                  background: styles.light,
                  color: styles.text,
                  justifyContent: 'flex-start',
                  padding: '16px',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <span style={{ marginRight: '12px' }}>🏦</span> Net Banking
                </button>
              </div>
            </div>
            
            <button
              onClick={() => {
                const updatedChallan = { ...selectedChallan, status: 'Paid' };
                alert('Payment Successful! (Demo Mode)');
                generateChallanPDF(updatedChallan);
                setShowPaymentModal(false);
                setSelectedChallan(null);
              }}
              style={{
                ...styles.button,
                width: '100%',
                background: styles.success,
                color: 'white',
                fontWeight: '600'
              }}
            >
              Confirm Payment & Download Receipt
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};