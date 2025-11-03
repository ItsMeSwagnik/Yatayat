const RecordViolation = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [mode, setMode] = useState('upload');
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [detectionsCount, setDetectionsCount] = useState(0);
  
  const handleProcessVideo = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setDetectionsCount(Math.floor(Math.random() * 10) + 3);
    }, 2000);
  };
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Record Violation</h2>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', background: styles.light }}>
          <button
            onClick={() => setMode('upload')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: mode === 'upload' ? styles.primary : 'transparent',
              color: mode === 'upload' ? 'white' : styles.text,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📤 Upload Video
          </button>
          <button
            onClick={() => setMode('live')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: mode === 'live' ? styles.primary : 'transparent',
              color: mode === 'live' ? 'white' : styles.text,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📹 Live Camera
          </button>
        </div>
        
        {mode === 'upload' ? (
          <div>
            <div style={{
              padding: '40px',
              border: `2px dashed ${styles.border}`,
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
              <div style={{ fontSize: '16px', color: styles.text, marginBottom: '8px', fontWeight: '500' }}>
                Choose CCTV footage or drop file here
              </div>
              <div style={{ fontSize: '12px', color: styles.textSecondary }}>Supported formats: MP4, AVI, MOV</div>
              <input type="file" accept="video/*" style={{ marginTop: '16px' }} />
            </div>
            
            <button
              onClick={handleProcessVideo}
              disabled={processing}
              style={{
                ...styles.button,
                background: styles.primary,
                color: 'white',
                width: '100%'
              }}
            >
              {processing ? '⏳ Processing Video...' : '▶️ Process Video'}
            </button>
            
            {processed && (
              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: '#DCFCE7',
                color: '#166534',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Processing Complete!
                </div>
                <div style={{ fontSize: '16px', marginBottom: '16px' }}>
                  {detectionsCount} violations detected
                </div>
                <button style={{
                  ...styles.button,
                  background: '#166534',
                  color: 'white'
                }}>
                  View Detected Violations →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{
              padding: '60px',
              background: styles.light,
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📹</div>
              <div style={{ fontSize: '18px', color: styles.text, marginBottom: '8px', fontWeight: '500' }}>
                Connect to CCTV/Webcam
              </div>
              <div style={{ fontSize: '14px', color: styles.textSecondary }}>
                Live detection will start automatically
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                ...styles.button,
                flex: 1,
                background: styles.success,
                color: 'white'
              }}>
                ▶️ Start Detection
              </button>
              <button style={{
                ...styles.button,
                flex: 1,
                background: styles.error,
                color: 'white'
              }}>
                ⏹ Stop Detection
              </button>
            </div>
            
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: styles.light,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: styles.text }}>Real-time Violation Counter:</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: styles.primary }}>0</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};