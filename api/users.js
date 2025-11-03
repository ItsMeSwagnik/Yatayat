import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('yatayat');
    
    if (req.method === 'GET') {
      // Get all users from database
      const users = await db.collection('users').find({}).toArray();
      // Return users without passwords
      const safeUsers = users.map(({ password, _id, ...user }) => ({ 
        id: _id.toString(), 
        ...user 
      }));
      res.status(200).json({ users: safeUsers });
      
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
      
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}