import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id } = req.query;
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
    
    if (req.method === 'PUT') {
      const updateData = req.body;
      
      // Handle status-only updates (from /status endpoint)
      if (updateData.status && Object.keys(updateData).length === 1) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: updateData.status } }
        );
        return res.status(200).json({ message: 'User status updated successfully' });
      }
      
      // Handle full user updates
      delete updateData._id;
      delete updateData.createdAt;
      
      await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      res.status(200).json({ message: 'User updated successfully' });
    }
    else if (req.method === 'DELETE') {
      await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'User deleted successfully' });
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ message: 'Database connection failed: ' + error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}