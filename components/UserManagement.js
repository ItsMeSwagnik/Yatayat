const UserManagement = () => {
  const { darkMode } = useAuth();
  const styles = getStyles(darkMode);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const response = await fetch(window.location.origin.includes('localhost') ? 'http://localhost:5000/api/users' : '/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const isNotAdmin = user.role !== 'admin';
    return matchesSearch && matchesRole && isNotAdmin;
  });
  
  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const user = users.find(u => u._id === id);
      let newStatus;
      
      if (user.role === 'police' && currentStatus === 'Pending') {
        newStatus = 'Active'; // Verify police account
      } else {
        newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      }
      
      const response = await fetch(`${window.location.origin.includes('localhost') ? 'http://localhost:5000' : ''}/api/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user._id === id ? { ...user, status: newStatus } : user
        ));
        
        if (user.role === 'police' && currentStatus === 'Pending') {
          alert('Police account verified successfully!');
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${window.location.origin.includes('localhost') ? 'http://localhost:5000' : ''}/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setUsers(prev => prev.filter(user => user._id !== id));
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };
  
  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowEditUser(true);
  };
  
  const updateUser = async (id, userData) => {
    try {
      const response = await fetch(`${window.location.origin.includes('localhost') ? 'http://localhost:5000' : ''}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user._id === id ? { ...user, ...userData } : user
        ));
        alert('User updated successfully!');
        setShowEditUser(false);
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };
  
  if (loading) {
    return (
      <div>
        <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>User Management</h2>
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div>
      <h2 style={{ color: styles.text, fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>User Management</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minWidth(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Users" value={users.filter(u => u.role !== 'admin').length} icon="👥" color="#2563EB" />
        <StatCard title="Active Users" value={users.filter(u => u.status === 'Active' && u.role !== 'admin').length} icon="✅" color="#10B981" />
        <StatCard title="Police Officers" value={users.filter(u => u.role === 'police').length} icon="👮" color="#F59E0B" />
        <StatCard title="Citizens" value={users.filter(u => u.role === 'citizen').length} icon="👤" color="#8B5CF6" />
      </div>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', flex: 1, minWidth: '300px' }}>
            <SearchBar placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ ...styles.input, width: 'auto', minWidth: '120px' }}>
              <option value="All">All Roles</option>
              <option value="citizen">Citizens</option>
              <option value="police">Police</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <button onClick={() => setShowAddUser(true)} style={{ ...styles.button, background: styles.primary, color: 'white' }}>+ Add User</button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Vehicles</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={styles.td}>{user.fullName}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}><span style={{ textTransform: 'capitalize', padding: '4px 8px', background: styles.light, borderRadius: '4px' }}>{user.role}</span></td>
                  <td style={styles.td}>{(user.vehicleNumbers || []).join(', ') || 'None'}</td>
                  <td style={styles.td}><StatusBadge status={user.status} /></td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => toggleUserStatus(user._id, user.status)} 
                        style={{ 
                          ...styles.button, 
                          background: user.role === 'police' && user.status === 'Pending' ? styles.success : (user.status === 'Active' ? styles.warning : styles.success), 
                          color: 'white', 
                          padding: '8px 12px', 
                          fontSize: '12px',
                          minWidth: '80px'
                        }}
                      >
                        {user.role === 'police' && user.status === 'Pending' ? 'Verify' : (user.status === 'Active' ? 'Deactivate' : 'Activate')}
                      </button>
                      <button 
                        onClick={() => handleEditClick(user)}
                        style={{ 
                          ...styles.button, 
                          background: styles.primary, 
                          color: 'white', 
                          padding: '8px 12px', 
                          fontSize: '12px',
                          minWidth: '60px'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(user)}
                        style={{ 
                          ...styles.button, 
                          background: styles.error, 
                          color: 'white', 
                          padding: '8px 12px', 
                          fontSize: '12px',
                          minWidth: '60px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: styles.textSecondary }}>
            No users found
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: styles.text, marginBottom: '8px' }}>
            Delete User
          </div>
          <div style={{ fontSize: '14px', color: styles.textSecondary, marginBottom: '24px' }}>
            Are you sure you want to delete <strong>{userToDelete?.fullName}</strong>? This action cannot be undone.
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => deleteUser(userToDelete?._id)}
              style={{
                ...styles.button,
                background: styles.error,
                color: 'white',
                padding: '12px 24px'
              }}
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                ...styles.button,
                background: styles.light,
                color: styles.text,
                padding: '12px 24px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Edit User Modal */}
      <Modal isOpen={showEditUser} onClose={() => setShowEditUser(false)} title="Edit User">
        {editingUser && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const userData = {
              fullName: formData.get('fullName'),
              email: formData.get('email'),
              role: formData.get('role')
            };
            if (formData.get('role') === 'citizen') {
              userData.vehicleNumbers = formData.get('vehicleNumbers')?.split(',').map(v => v.trim()) || [];
            }
            updateUser(editingUser._id, userData);
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Full Name</label>
              <input name="fullName" type="text" defaultValue={editingUser.fullName} required style={styles.input} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Email</label>
              <input name="email" type="email" defaultValue={editingUser.email} required style={styles.input} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Role</label>
              <select name="role" defaultValue={editingUser.role} required style={styles.input}>
                <option value="citizen">Citizen</option>
                <option value="police">Police Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {editingUser.role === 'citizen' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Vehicle Numbers</label>
                <input name="vehicleNumbers" type="text" defaultValue={editingUser.vehicleNumbers?.join(', ')} style={styles.input} placeholder="e.g., MH12AB1234, MH14CD5678" />
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" style={{ ...styles.button, flex: 1, background: styles.primary, color: 'white' }}>Update User</button>
              <button type="button" onClick={() => setShowEditUser(false)} style={{ ...styles.button, flex: 1, background: styles.light, color: styles.text }}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
      
      {/* Add User Modal */}
      <Modal isOpen={showAddUser} onClose={() => setShowAddUser(false)} title="Add New User">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          try {
            const response = await fetch(window.location.origin.includes('localhost') ? 'http://localhost:5000/api/register' : '/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role'),
                fullName: formData.get('fullName'),
                vehicleNumbers: formData.get('role') === 'citizen' ? formData.get('vehicleNumbers')?.split(',').map(v => v.trim()) : undefined,
                officerId: formData.get('role') === 'police' ? `POL${Date.now().toString().slice(-3)}` : undefined
              })
            });
            
            if (response.ok) {
              alert('User added successfully!');
              setShowAddUser(false);
              fetchUsers();
            } else {
              const data = await response.json();
              alert(data.message || 'Failed to add user');
            }
          } catch (error) {
            alert('Error adding user');
          }
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Full Name</label>
            <input name="fullName" type="text" required style={styles.input} placeholder="Enter full name" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Email</label>
            <input name="email" type="email" required style={styles.input} placeholder="Enter email address" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Role</label>
            <select name="role" required style={styles.input}>
              <option value="">Select Role</option>
              <option value="citizen">Citizen</option>
              <option value="police">Police Officer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: styles.text, fontWeight: '500' }}>Password</label>
            <input name="password" type="password" required style={styles.input} placeholder="Enter password" />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ ...styles.button, flex: 1, background: styles.primary, color: 'white' }}>Add User</button>
            <button type="button" onClick={() => setShowAddUser(false)} style={{ ...styles.button, flex: 1, background: styles.light, color: styles.text }}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};