const AdminHelpSupport = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([
    { id: 'T001', subject: 'Payment Issue', user: 'john@citizen.com', priority: 'High', status: 'Open', created: '2025-11-02T10:30:00', description: 'Unable to process payment for challan CH001' },
    { id: 'T002', subject: 'Challan Dispute', user: 'officer@police.gov.in', priority: 'Medium', status: 'In Progress', created: '2025-11-01T14:20:00', description: 'Need to review challan CH003 for accuracy' },
    { id: 'T003', subject: 'System Access', user: 'user@example.com', priority: 'Low', status: 'Resolved', created: '2025-10-30T09:15:00', description: 'Cannot login to citizen portal' }
  ]);

  const handleTicketAction = (ticketId, action) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: action } : ticket
    ));
    alert(`Ticket ${ticketId} marked as ${action}`);
  };

  const renderTickets = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Tickets" value={tickets.length} icon="🎫" color="#2563EB" />
        <StatCard title="Open Tickets" value={tickets.filter(t => t.status === 'Open').length} icon="🔓" color="#EF4444" />
        <StatCard title="In Progress" value={tickets.filter(t => t.status === 'In Progress').length} icon="⏳" color="#F59E0B" />
        <StatCard title="Resolved" value={tickets.filter(t => t.status === 'Resolved').length} icon="✅" color="#10B981" />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Support Tickets</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ticket ID</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td style={styles.td}>{ticket.id}</td>
                  <td style={styles.td}>{ticket.subject}</td>
                  <td style={styles.td}>{ticket.user}</td>
                  <td style={styles.td}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: ticket.priority === 'High' ? '#FEE2E2' : ticket.priority === 'Medium' ? '#FEF3C7' : '#DCFCE7',
                      color: ticket.priority === 'High' ? '#991B1B' : ticket.priority === 'Medium' ? '#92400E' : '#166534'
                    }}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td style={styles.td}><StatusBadge status={ticket.status} /></td>
                  <td style={styles.td}>{new Date(ticket.created).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedTicket(ticket)}
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
                      {ticket.status !== 'Resolved' && (
                        <button
                          onClick={() => handleTicketAction(ticket.id, 'Resolved')}
                          style={{
                            ...styles.button,
                            background: styles.success,
                            color: 'white',
                            padding: '6px 12px',
                            fontSize: '12px'
                          }}
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div style={styles.card}>
      <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Knowledge Base Management</h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ padding: '16px', background: styles.light, borderRadius: '8px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: styles.text, marginBottom: '8px' }}>Payment Processing Issues</div>
          <div style={{ fontSize: '14px', color: styles.textSecondary, marginBottom: '12px' }}>Common solutions for payment failures and processing delays</div>
          <button style={{ ...styles.button, background: styles.primary, color: 'white', padding: '6px 12px', fontSize: '12px' }}>Edit Article</button>
        </div>
        <div style={{ padding: '16px', background: styles.light, borderRadius: '8px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: styles.text, marginBottom: '8px' }}>Challan Dispute Process</div>
          <div style={{ fontSize: '14px', color: styles.textSecondary, marginBottom: '12px' }}>Step-by-step guide for handling challan disputes</div>
          <button style={{ ...styles.button, background: styles.primary, color: 'white', padding: '6px 12px', fontSize: '12px' }}>Edit Article</button>
        </div>
        <div style={{ padding: '16px', background: styles.light, borderRadius: '8px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: styles.text, marginBottom: '8px' }}>System Access & Login</div>
          <div style={{ fontSize: '14px', color: styles.textSecondary, marginBottom: '12px' }}>Troubleshooting login and access issues</div>
          <button style={{ ...styles.button, background: styles.primary, color: 'white', padding: '6px 12px', fontSize: '12px' }}>Edit Article</button>
        </div>
      </div>
      <button style={{ ...styles.button, background: styles.success, color: 'white', marginTop: '16px' }}>+ Add New Article</button>
    </div>
  );

  const renderUserSupport = () => (
    <div style={styles.card}>
      <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>User Support Tools</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: styles.light, borderRadius: '8px' }}>
          <h4 style={{ color: styles.text, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Send System Notification</h4>
          <textarea 
            placeholder="Enter notification message for all users..."
            style={{ ...styles.input, minHeight: '80px', marginBottom: '12px' }}
          />
          <button style={{ ...styles.button, background: styles.primary, color: 'white', width: '100%' }}>Send Notification</button>
        </div>
        
        <div style={{ padding: '20px', background: styles.light, borderRadius: '8px' }}>
          <h4 style={{ color: styles.text, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>User Account Management</h4>
          <input 
            placeholder="Enter user email..."
            style={{ ...styles.input, marginBottom: '12px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ ...styles.button, background: styles.warning, color: 'white', flex: 1, fontSize: '12px' }}>Reset Password</button>
            <button style={{ ...styles.button, background: styles.error, color: 'white', flex: 1, fontSize: '12px' }}>Suspend Account</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Admin Help & Support</h2>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', background: styles.light }}>
        <button
          onClick={() => setActiveTab('tickets')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            background: activeTab === 'tickets' ? styles.primary : 'transparent',
            color: activeTab === 'tickets' ? 'white' : styles.text,
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🎫 Support Tickets
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            background: activeTab === 'knowledge' ? styles.primary : 'transparent',
            color: activeTab === 'knowledge' ? 'white' : styles.text,
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📚 Knowledge Base
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            background: activeTab === 'tools' ? styles.primary : 'transparent',
            color: activeTab === 'tools' ? 'white' : styles.text,
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🛠️ Support Tools
        </button>
      </div>

      {activeTab === 'tickets' && renderTickets()}
      {activeTab === 'knowledge' && renderKnowledgeBase()}
      {activeTab === 'tools' && renderUserSupport()}

      {/* Ticket Details Modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Ticket Details">
        {selectedTicket && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Ticket ID</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: styles.text }}>{selectedTicket.id}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Subject</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedTicket.subject}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>User</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: styles.text }}>{selectedTicket.user}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Description</div>
              <div style={{ fontSize: '14px', color: styles.text, padding: '12px', background: styles.light, borderRadius: '8px' }}>
                {selectedTicket.description}
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Response</div>
              <textarea 
                placeholder="Enter your response..."
                style={{ ...styles.input, minHeight: '100px', marginTop: '8px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  handleTicketAction(selectedTicket.id, 'In Progress');
                  setSelectedTicket(null);
                }}
                style={{
                  ...styles.button,
                  flex: 1,
                  background: styles.warning,
                  color: 'white'
                }}
              >
                Mark In Progress
              </button>
              <button
                onClick={() => {
                  handleTicketAction(selectedTicket.id, 'Resolved');
                  setSelectedTicket(null);
                }}
                style={{
                  ...styles.button,
                  flex: 1,
                  background: styles.success,
                  color: 'white'
                }}
              >
                Resolve Ticket
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};