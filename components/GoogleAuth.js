const GoogleAuth = () => {
  const [selectedRole, setSelectedRole] = React.useState('citizen');
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    // Security check: Prevent admin login via Google
    if (selectedRole === 'admin') {
      alert('Admin login is not allowed through Google authentication for security reasons. Please use email/password login.');
      return;
    }
    
    setLoading(true);
    try {
      const result = await googleAuth.signInWithGoogle(selectedRole);
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.reload();
      } else {
        alert('Sign in failed: ' + result.error);
      }
    } catch (error) {
      alert('Sign in error: ' + error.message);
    }
    setLoading(false);
  };

  return React.createElement('div', {
    style: {
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#f9f9f9'
    }
  }, [
    React.createElement('h3', { key: 'title' }, 'Sign in with Google'),
    
    React.createElement('div', {
      key: 'role-selection',
      style: { margin: '15px 0' }
    }, [
      React.createElement('label', { key: 'label' }, 'Select Role: '),
      React.createElement('select', {
        key: 'select',
        value: selectedRole,
        onChange: (e) => setSelectedRole(e.target.value),
        style: { marginLeft: '10px', padding: '5px' }
      }, [
        React.createElement('option', { key: 'citizen', value: 'citizen' }, 'Citizen'),
        React.createElement('option', { key: 'police', value: 'police' }, 'Police Officer'),

      ])
    ]),
    
    React.createElement('button', {
      key: 'button',
      onClick: handleGoogleSignIn,
      disabled: loading,
      style: {
        backgroundColor: '#4285f4',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1
      }
    }, loading ? 'Signing in...' : '🔍 Sign in with Google')
  ]);
};

window.GoogleAuth = GoogleAuth;