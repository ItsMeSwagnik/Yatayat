const HelpSupport = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  
  const faqs = [
    { q: 'How do I pay my challan online?', a: 'You can pay your challan through the "My Challans" section using UPI, Card, or Net Banking.' },
    { q: 'How long does it take for violation detection?', a: 'AI-powered violation detection typically processes within 2-5 minutes of upload.' },
    { q: 'Can I dispute a challan?', a: 'Yes, you can raise a dispute through the challan details page within 15 days of issuance.' },
    { q: 'What are the different violation types?', a: 'We detect helmet violations, red light jumping, triple riding, and speeding violations.' }
  ];
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Help & Support</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📞</div>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Phone Support</h3>
          <p style={{ color: styles.textSecondary, marginBottom: '12px' }}>24/7 helpline available</p>
          <p style={{ color: styles.primary, fontWeight: '600' }}>+91-1800-123-4567</p>
        </div>
        
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Email Support</h3>
          <p style={{ color: styles.textSecondary, marginBottom: '12px' }}>Response within 24 hours</p>
          <p style={{ color: styles.primary, fontWeight: '600' }}>support@yatayat.gov.in</p>
        </div>
        
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Live Chat</h3>
          <p style={{ color: styles.textSecondary, marginBottom: '12px' }}>Instant assistance</p>
          <button style={{ ...styles.button, background: styles.primary, color: 'white' }}>Start Chat</button>
        </div>
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ padding: '16px', background: styles.light, borderRadius: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: styles.text, marginBottom: '8px' }}>Q: {faq.q}</div>
              <div style={{ fontSize: '14px', color: styles.textSecondary }}>A: {faq.a}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Submit a Ticket</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Support ticket submitted successfully!'); }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Subject</label>
              <input type="text" required style={styles.input} placeholder="Brief description of your issue" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Priority</label>
              <select required style={styles.input}>
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Description</label>
            <textarea required style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }} placeholder="Detailed description of your issue or question"></textarea>
          </div>
          <button type="submit" style={{ ...styles.button, background: styles.primary, color: 'white' }}>Submit Ticket</button>
        </form>
      </div>
    </div>
  );
};