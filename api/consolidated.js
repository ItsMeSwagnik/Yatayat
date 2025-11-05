import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { endpoint, id } = req.query;
  let client;
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not configured');
    }
    
    client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    
    await client.connect();
    const db = client.db('yatayat');
    
    // Route to appropriate handler
    switch (endpoint) {
      case 'vehicles':
        return await handleVehicles(req, res, db, id);
      case 'google-auth':
        return await handleGoogleAuth(req, res, db);
      case 'google-users':
        return await handleGoogleUsers(req, res, db);
      case 'google-vehicles':
        return await handleGoogleVehicles(req, res, db);
      default:
        return res.status(404).json({ message: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Database connection failed: ' + error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function handleVehicles(req, res, db, id) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ vehicles: user.vehicleNumbers || [] });
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
      return res.status(500).json({ message: 'Error fetching vehicles' });
    }
  }
  
  if (req.method === 'POST') {
    const { userId, vehicleNumber } = req.body;
    if (!userId || !vehicleNumber) {
      return res.status(400).json({ message: 'User ID and vehicle number are required' });
    }
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { vehicleNumbers: vehicleNumber.toUpperCase() } }
    );
    
    return res.status(200).json({ message: 'Vehicle added successfully' });
  }
  
  if (req.method === 'DELETE') {
    const { userId, vehicleNumber } = req.body;
    if (!userId || !vehicleNumber) {
      return res.status(400).json({ message: 'User ID and vehicle number are required' });
    }
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { vehicleNumbers: vehicleNumber } }
    );
    
    return res.status(200).json({ message: 'Vehicle removed successfully' });
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

async function handleGoogleAuth(req, res, db) {
  if (req.method === 'POST') {
    const { email, name, picture, uid, role } = req.body;
    
    // Security check: Prevent admin accounts via Google auth
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be created through Google authentication' });
    }
    
    try {
      let user = await db.collection('users').findOne({ email });
      
      if (!user) {
        user = {
          email,
          fullName: name,
          photoURL: picture,
          uid,
          role: role || 'citizen',
          status: (role === 'police') ? 'Pending' : 'Active',
          provider: 'google',
          vehicleNumbers: [],
          createdAt: new Date()
        };
        await db.collection('users').insertOne(user);
      } else {
        // Security check: Prevent existing admin accounts from being accessed via Google
        if (user.role === 'admin') {
          return res.status(403).json({ message: 'Admin accounts cannot be accessed through Google authentication' });
        }
        
        if (!user.uid) {
          await db.collection('users').updateOne(
            { email },
            { $set: { uid, provider: 'google', photoURL: picture } }
          );
          user.uid = uid;
          user.provider = 'google';
          user.photoURL = picture;
        }
      }
      
      return res.status(200).json({ user });
    } catch (error) {
      console.error('Error in Google auth:', error);
      return res.status(500).json({ message: 'Authentication error' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

async function handleGoogleUsers(req, res, db) {
  if (req.method === 'GET') {
    try {
      const users = await db.collection('users').find({ provider: 'google' }).toArray();
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching Google users:', error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  }
  
  if (req.method === 'PUT') {
    const { uid, status, role } = req.body;
    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }
    
    try {
      await db.collection('users').updateOne(
        { uid },
        { $set: { status, role } }
      );
      
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  }
  
  if (req.method === 'DELETE') {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }
    
    try {
      await db.collection('users').deleteOne({ uid });
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Error deleting user' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

async function handleGoogleVehicles(req, res, db) {
  if (req.method === 'GET') {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ message: 'User UID is required' });
    }
    
    try {
      const user = await db.collection('users').findOne({ uid });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ vehicles: user.vehicleNumbers || [] });
    } catch (error) {
      console.error('Error fetching Google user vehicles:', error);
      return res.status(500).json({ message: 'Error fetching vehicles' });
    }
  }
  
  if (req.method === 'POST') {
    const { uid, vehicleNumber } = req.body;
    if (!uid || !vehicleNumber) {
      return res.status(400).json({ message: 'UID and vehicle number are required' });
    }
    
    try {
      await db.collection('users').updateOne(
        { uid },
        { $addToSet: { vehicleNumbers: vehicleNumber.toUpperCase() } }
      );
      
      return res.status(200).json({ message: 'Vehicle added successfully' });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      return res.status(500).json({ message: 'Error adding vehicle' });
    }
  }
  
  if (req.method === 'DELETE') {
    const { uid, vehicleNumber } = req.body;
    if (!uid || !vehicleNumber) {
      return res.status(400).json({ message: 'UID and vehicle number are required' });
    }
    
    try {
      await db.collection('users').updateOne(
        { uid },
        { $pull: { vehicleNumbers: vehicleNumber } }
      );
      
      return res.status(200).json({ message: 'Vehicle removed successfully' });
    } catch (error) {
      console.error('Error removing vehicle:', error);
      return res.status(500).json({ message: 'Error removing vehicle' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}