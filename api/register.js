import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, role, fullName, vehicleNumbers, officerId } = req.body;

  // Basic validation
  if (!email || !password || !role || !fullName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('yatayat');
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = {
      email,
      password: hashedPassword,
      role,
      fullName,
      vehicleNumbers: role === 'citizen' ? vehicleNumbers : undefined,
      officerId: role === 'police' ? officerId : undefined,
      status: 'Active',
      createdAt: new Date()
    };
    
    // Save to database
    const result = await db.collection('users').insertOne(newUser);
    console.log('User saved to database:', result.insertedId);
    
    res.status(201).json({ 
      message: 'Registration successful',
      user: { email, role, fullName, vehicleNumbers, officerId }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}