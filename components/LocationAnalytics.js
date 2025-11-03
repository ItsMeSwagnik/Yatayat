const LocationAnalytics = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  
  const violationHeatmapData = [
    [18.5204, 73.8567, 45], // MG Road Junction
    [18.5074, 73.8077, 38], // FC Road Signal
    [18.5642, 73.7769, 32], // Baner Chowk
    [18.5089, 73.8055, 28], // Highway Express
    [18.5074, 73.8077, 21]  // Kothrud Depot
  ];
  
  useEffect(() => {
    if (mapRef.current && !map && window.L) {
      const newMap = window.L.map(mapRef.current).setView([18.5204, 73.8567], 12);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(newMap);
      
      if (window.L.heatLayer) {
        const heatLayer = window.L.heatLayer(violationHeatmapData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: {
            0.0: 'blue',
            0.5: 'yellow', 
            1.0: 'red'
          }
        }).addTo(newMap);
      }
      
      topLocations.forEach((location, index) => {
        const coords = violationHeatmapData[index];
        if (coords) {
          window.L.marker([coords[0], coords[1]])
            .addTo(newMap)
            .bindPopup(`<b>${location.location}</b><br/>${location.violations} violations`);
        }
      });
      
      setMap(newMap);
    }
    
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [mapRef.current, darkMode]);
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Location Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Locations" value="25" icon="📍" color="#2563EB" />
        <StatCard title="Hotspot Areas" value="5" icon="🔥" color="#EF4444" />
        <StatCard title="Top Location" value="MG Road" icon="🏆" color="#F59E0B" subtitle="45 violations" />
        <StatCard title="Coverage" value="85%" icon="🗺️" color="#10B981" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Top Violation Locations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topLocations}>
              <CartesianGrid strokeDasharray="3 3" stroke={styles.border} />
              <XAxis dataKey="location" stroke={styles.textSecondary} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke={styles.textSecondary} />
              <Tooltip contentStyle={{ background: styles.cardBg, border: `1px solid ${styles.border}` }} />
              <Bar dataKey="violations" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: styles.text, fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Violation Heatmap</h3>
          <div ref={mapRef} style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}></div>
        </div>
      </div>
      
      <div style={styles.card}>
        <h3 style={{ color: styles.text, fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Location Details</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Total Violations</th>
                <th style={styles.th}>Most Common Type</th>
                <th style={styles.th}>Peak Hours</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {topLocations.map((location, index) => (
                <tr key={index}>
                  <td style={styles.td}>{location.location}</td>
                  <td style={styles.td}>{location.violations}</td>
                  <td style={styles.td}>Red Light</td>
                  <td style={styles.td}>8-10 AM, 6-8 PM</td>
                  <td style={styles.td}><StatusBadge status={location.violations > 40 ? 'High Risk' : location.violations > 25 ? 'Medium Risk' : 'Low Risk'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};