import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, role } = req.body;
  
  try {
    const client = await clientPromise;
    const db = client.db('yatayat');
    
    // Find user by email and role
    const user = await db.collection('users').findOne({ email, role });

    if (user && await bcrypt.compare(password, user.password)) {
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
    res.status(500).json({ message: 'Internal server error' });
  }
}