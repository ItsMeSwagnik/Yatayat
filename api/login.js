import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

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

  const { email, password, role } = req.body;
  
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
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
    
    const user = await db.collection('users').findOne({ email, role });

    if (user && await bcrypt.compare(password, user.password)) {
      // Check if police officer is verified
      if (user.role === 'police' && user.status === 'Pending') {
        return res.status(401).json({ message: 'Account pending admin verification' });
      }
      
      // Check if user is active
      if (user.status === 'Inactive') {
        return res.status(401).json({ message: 'Account has been deactivated' });
      }
      
      const { password: _, _id, ...userWithoutPassword } = user;
      res.status(200).json({ 
        token: 'mock-jwt-token', 
        user: { id: _id.toString(), ...userWithoutPassword }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Database connection failed: ' + error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}