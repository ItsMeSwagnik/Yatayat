import { MongoClient } from 'mongodb';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { credential, role } = req.body;
  
  // Security check: Prevent admin login via Google
  if (role === 'admin') {
    return res.status(403).json({ 
      message: 'Admin accounts cannot be accessed through Google authentication for security reasons' 
    });
  }
  
  if (!credential || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  let mongoClient;
  
  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: uid, email, name, picture } = payload;
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not configured');
    }
    
    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    
    await mongoClient.connect();
    const db = mongoClient.db('yatayat');
    
    // Check if user exists
    let user = await db.collection('users').findOne({ email });
    
    if (!user) {
      // Create new user
      user = {
        email,
        fullName: name,
        photoURL: picture,
        uid,
        role: role,
        status: role === 'police' ? 'Pending' : 'Active',
        provider: 'google',
        vehicleNumbers: [],
        createdAt: new Date()
      };
      
      const result = await db.collection('users').insertOne(user);
      user._id = result.insertedId;
    } else {
      // Security check: Prevent existing admin accounts from being accessed via Google
      if (user.role === 'admin') {
        return res.status(403).json({ 
          message: 'Admin accounts cannot be accessed through Google authentication' 
        });
      }
      
      // Update existing user with Google info if not already set
      if (!user.uid || !user.provider) {
        await db.collection('users').updateOne(
          { email },
          { 
            $set: { 
              uid, 
              provider: 'google', 
              photoURL: picture,
              fullName: name
            } 
          }
        );
        user.uid = uid;
        user.provider = 'google';
        user.photoURL = picture;
        user.fullName = name;
      }
    }
    
    // Check user status for login eligibility
    if (user.role === 'police' && user.status === 'Pending') {
      return res.status(401).json({ 
        message: 'Police account pending admin verification. Please contact administrator.' 
      });
    }
    
    if (user.status === 'Inactive') {
      return res.status(401).json({ 
        message: 'Account has been deactivated. Please contact administrator.' 
      });
    }
    
    // Return user data (excluding sensitive info)
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ 
      token: 'google-auth-token', 
      user: { 
        id: user._id.toString(), 
        ...userWithoutPassword 
      }
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    
    if (error.message.includes('Invalid token')) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }
    
    res.status(500).json({ 
      message: 'Authentication failed: ' + error.message 
    });
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}