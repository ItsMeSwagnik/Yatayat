const CitizenProfile = () => {
  const [user, setUser] = React.useState(null);
  const [vehicles, setVehicles] = React.useState([]);
  const [newVehicle, setNewVehicle] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    if (userData && (userData.id || userData._id || userData.uid)) {
      fetchVehicles(userData);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchVehicles = async (userData) => {
    try {
      if (!userData || (!userData.id && !userData._id && !userData.uid)) {
        setLoading(false);
        return;
      }
      
      const userId = userData.id || userData._id;
      const endpoint = userData.provider === 'google' ? 
        `/api/consolidated?endpoint=google-vehicles&uid=${userData.uid}` : 
        `/api/consolidated?endpoint=vehicles&userId=${userId}`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
    setLoading(false);
  };

  const addVehicle = async () => {
    if (!newVehicle.trim()) return;
    
    try {
      const endpoint = user.provider === 'google' ? '/api/consolidated?endpoint=google-vehicles' : '/api/consolidated?endpoint=vehicles';
      const userId = user.id || user._id;
      const body = user.provider === 'google' ? 
        { uid: user.uid, vehicleNumber: newVehicle.toUpperCase() } :
        { userId: userId, vehicleNumber: newVehicle.toUpperCase() };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setNewVehicle('');
        fetchVehicles(user);
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const removeVehicle = async (vehicleNumber) => {
    try {
      const endpoint = user.provider === 'google' ? '/api/consolidated?endpoint=google-vehicles' : '/api/consolidated?endpoint=vehicles';
      const userId = user.id || user._id;
      const body = user.provider === 'google' ? 
        { uid: user.uid, vehicleNumber } :
        { userId: userId, vehicleNumber };

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchVehicles(user);
      }
    } catch (error) {
      console.error('Error removing vehicle:', error);
    }
  };

  if (loading) return React.createElement('div', null, 'Loading profile...');

  return React.createElement('div', {
    style: { padding: '20px', maxWidth: '800px', margin: '0 auto' }
  }, [
    React.createElement('h2', { key: 'title' }, '👤 My Profile'),
    
    // Profile Info
    React.createElement('div', {
      key: 'profile-info',
      style: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }
    }, [
      user.photoURL && React.createElement('img', {
        key: 'photo',
        src: user.photoURL,
        alt: 'Profile',
        style: { width: '80px', height: '80px', borderRadius: '50%' }
      }),
      
      React.createElement('div', { key: 'details' }, [
        React.createElement('h3', { key: 'name' }, user.displayName || user.name || 'User'),
        React.createElement('p', { key: 'email' }, `📧 ${user.email}`),
        React.createElement('p', { key: 'role' }, `🎭 Role: ${user.role || 'Citizen'}`),
        user.provider === 'google' && React.createElement('p', { 
          key: 'provider',
          style: { color: '#4285f4', fontWeight: 'bold' }
        }, '🔍 Google Account')
      ])
    ]),

    // Vehicle Management
    React.createElement('div', {
      key: 'vehicles-section',
      style: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }
    }, [
      React.createElement('h3', { key: 'vehicles-title' }, '🚗 My Vehicles'),
      
      // Add Vehicle
      React.createElement('div', {
        key: 'add-vehicle',
        style: { margin: '15px 0', display: 'flex', gap: '10px' }
      }, [
        React.createElement('input', {
          key: 'input',
          type: 'text',
          placeholder: 'Enter vehicle number (e.g., MH12AB1234)',
          value: newVehicle,
          onChange: (e) => setNewVehicle(e.target.value.toUpperCase()),
          style: {
            flex: 1,
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }
        }),
        React.createElement('button', {
          key: 'add-btn',
          onClick: addVehicle,
          style: {
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, 'Add Vehicle')
      ]),

      // Vehicle List
      vehicles.length === 0 ? 
        React.createElement('p', { 
          key: 'no-vehicles',
          style: { textAlign: 'center', color: '#666', margin: '20px 0' }
        }, 'No vehicles registered') :
        
        React.createElement('div', { key: 'vehicle-list' },
          vehicles.map((vehicle, index) =>
            React.createElement('div', {
              key: index,
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #e9ecef'
              }
            }, [
              React.createElement('span', {
                key: 'number',
                style: { fontWeight: 'bold', fontSize: '16px' }
              }, vehicle.vehicleNumber || vehicle),
              
              React.createElement('button', {
                key: 'remove',
                onClick: () => removeVehicle(vehicle.vehicleNumber || vehicle),
                style: {
                  padding: '4px 8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }
              }, 'Remove')
            ])
          )
        )
    ])
  ]);
};

window.CitizenProfile = CitizenProfile;