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

  const { email, password, role, fullName, vehicleNumbers, officerId } = req.body;
  
  if (!email || !password || !role || !fullName) {
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
    
    const existingUser = await db.collection('users').findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = {
      email,
      password: hashedPassword,
      role,
      fullName,
      status: role === 'police' ? 'Pending' : 'Active',
      createdAt: new Date(),
      ...(vehicleNumbers && { vehicleNumbers }),
      ...(officerId && { officerId })
    };

    await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Database connection failed: ' + error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}