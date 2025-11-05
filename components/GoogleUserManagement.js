const GoogleUserManagement = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchGoogleUsers();
  }, []);

  const fetchGoogleUsers = async () => {
    try {
      const response = await fetch('/api/google-users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching Google users:', error);
    }
    setLoading(false);
  };

  const updateUserStatus = async (uid, status) => {
    try {
      const response = await fetch('/api/google-users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, status, role: users.find(u => u.uid === uid).role })
      });
      
      if (response.ok) {
        fetchGoogleUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (uid) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch('/api/google-users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid })
        });
        
        if (response.ok) {
          fetchGoogleUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return React.createElement('div', null, 'Loading Google users...');
  }

  return React.createElement('div', {
    style: { padding: '20px' }
  }, [
    React.createElement('h2', { key: 'title' }, 'Google Users Management'),
    
    React.createElement('div', {
      key: 'table-container',
      style: { overflowX: 'auto' }
    }, 
      React.createElement('table', {
        style: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' }
      }, [
        React.createElement('thead', { key: 'thead' },
          React.createElement('tr', null, [
            React.createElement('th', { key: 'photo', style: { border: '1px solid #ddd', padding: '8px' } }, 'Photo'),
            React.createElement('th', { key: 'name', style: { border: '1px solid #ddd', padding: '8px' } }, 'Name'),
            React.createElement('th', { key: 'email', style: { border: '1px solid #ddd', padding: '8px' } }, 'Email'),
            React.createElement('th', { key: 'role', style: { border: '1px solid #ddd', padding: '8px' } }, 'Role'),
            React.createElement('th', { key: 'vehicles', style: { border: '1px solid #ddd', padding: '8px' } }, 'Vehicles'),
            React.createElement('th', { key: 'status', style: { border: '1px solid #ddd', padding: '8px' } }, 'Status'),
            React.createElement('th', { key: 'actions', style: { border: '1px solid #ddd', padding: '8px' } }, 'Actions')
          ])
        ),
        
        React.createElement('tbody', { key: 'tbody' },
          users.map(user => 
            React.createElement('tr', { key: user.uid }, [
              React.createElement('td', { 
                key: 'photo',
                style: { border: '1px solid #ddd', padding: '8px', textAlign: 'center' }
              }, 
                user.photoURL ? 
                  React.createElement('img', {
                    src: user.photoURL,
                    alt: user.displayName,
                    style: { width: '40px', height: '40px', borderRadius: '50%' }
                  }) : '👤'
              ),
              React.createElement('td', { 
                key: 'name',
                style: { border: '1px solid #ddd', padding: '8px' }
              }, user.displayName || 'N/A'),
              React.createElement('td', { 
                key: 'email',
                style: { border: '1px solid #ddd', padding: '8px' }
              }, user.email),
              React.createElement('td', { 
                key: 'role',
                style: { border: '1px solid #ddd', padding: '8px' }
              }, user.role),
              React.createElement('td', { 
                key: 'vehicles',
                style: { border: '1px solid #ddd', padding: '8px' }
              }, (user.vehicleNumbers || []).join(', ') || 'None'),
              React.createElement('td', { 
                key: 'status',
                style: { border: '1px solid #ddd', padding: '8px' }
              }, 
                React.createElement('span', {
                  style: {
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: user.status === 'active' ? '#d4edda' : '#f8d7da',
                    color: user.status === 'active' ? '#155724' : '#721c24'
                  }
                }, user.status)
              ),
              React.createElement('td', { 
                key: 'actions',
                style: { border: '1px solid #ddd', padding: '8px' }
              }, [
                React.createElement('button', {
                  key: 'toggle',
                  onClick: () => updateUserStatus(user.uid, user.status === 'active' ? 'inactive' : 'active'),
                  style: {
                    marginRight: '5px',
                    padding: '4px 8px',
                    backgroundColor: user.status === 'active' ? '#dc3545' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }
                }, user.status === 'active' ? 'Deactivate' : 'Activate'),
                
                React.createElement('button', {
                  key: 'delete',
                  onClick: () => deleteUser(user.uid),
                  style: {
                    padding: '4px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }
                }, 'Delete')
              ])
            ])
          )
        )
      ])
    )
  ]);
};

window.GoogleUserManagement = GoogleUserManagement;