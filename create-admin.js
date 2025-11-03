const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createUsers() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('yatayat');
    
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    const users = [
      {
        username: 'admin_system',
        email: 'admin@yatayat.gov.in',
        password: hashedPassword,
        role: 'admin',
        fullName: 'Admin System',
        status: 'Active',
        createdAt: new Date()
      },
      {
        username: 'officer_swag',
        email: 'officer@police.gov.in',
        password: hashedPassword,
        role: 'police',
        fullName: 'Officer Swag',
        officerId: 'POL001',
        status: 'Active',
        createdAt: new Date()
      },
      {
        username: 'john_citizen',
        email: 'john@citizen.com',
        password: hashedPassword,
        role: 'citizen',
        fullName: 'John Citizen',
        vehicleNumbers: ['MH12AB1234', 'MH14CD5678'],
        status: 'Active',
        createdAt: new Date()
      }
    ];
    
    for (const user of users) {
      const existing = await db.collection('users').findOne({ email: user.email });
      if (!existing) {
        await db.collection('users').insertOne(user);
        console.log(`✅ ${user.role} user created: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }
    
    await client.close();
  } catch (error) {
    console.error('❌ Error creating users:', error);
  }
}

createUsers();