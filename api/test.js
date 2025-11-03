import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'MONGODB_URI environment variable not set',
        env: Object.keys(process.env).filter(key => key.includes('MONGO'))
      });
    }
    
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('yatayat');
    const userCount = await db.collection('users').countDocuments();
    
    await client.close();
    
    res.status(200).json({ 
      success: true, 
      message: 'MongoDB connection successful',
      userCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('MongoDB test error:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      name: error.name
    });
  }
}