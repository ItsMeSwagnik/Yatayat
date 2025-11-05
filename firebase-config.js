// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkrkJWk-OFRWhxcZbinI2OjKAq2cWSngE",
  authDomain: "yatayat-1e61d.firebaseapp.com",
  projectId: "yatayat-1e61d",
  storageBucket: "yatayat-1e61d.firebasestorage.app",
  messagingSenderId: "913404467913",
  appId: "1:913404467913:web:4804a9a1fbd05cc65d4b18",
  measurementId: "G-5CD0GXHYT5"
};

// Initialize Firebase
let app;
if (window.firebase) {
  if (!window.firebase.apps.length) {
    app = window.firebase.initializeApp(firebaseConfig);
  } else {
    app = window.firebase.app();
  }
}

// Google Auth Functions
const googleAuth = {
  signInWithGoogle: async (selectedRole) => {
    if (!window.firebase || !window.firebase.auth) {
      throw new Error('Firebase not initialized');
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      
      // Security check: Prevent admin role assignment via Google
      if (selectedRole === 'admin') {
        throw new Error('Admin accounts cannot be created through Google authentication');
      }
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: selectedRole,
        status: selectedRole === 'police' ? 'pending' : 'active',
        createdAt: new Date().toISOString(),
        provider: 'google'
      };
      
      // Store in Firebase Firestore
      if (window.firebase.firestore) {
        await firebase.firestore().collection('users').doc(user.uid).set(userData);
      }
      
      // Get ID token for server verification
      const idToken = await user.getIdToken();
      
      // Send to MongoDB via new Google auth endpoint
      const response = await fetch('/api/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: idToken,
          role: selectedRole
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to authenticate with server');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  },
  
  signOut: async () => {
    try {
      await firebase.auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};