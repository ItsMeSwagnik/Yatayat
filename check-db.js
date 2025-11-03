const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkDatabase() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('yatayat');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check users collection
    const userCount = await db.collection('users').countDocuments();
    console.log('Total users:', userCount);
    
    // List all users
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    console.log('Users:', users);
    
    // Check indexes
    const indexes = await db.collection('users').indexes();
    console.log('Indexes:', indexes);
    
    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();