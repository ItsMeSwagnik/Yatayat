import dotenv from 'dotenv';
import clientPromise from './lib/mongodb.js';

dotenv.config();

async function fixDatabaseIndex() {
  try {
    const client = await clientPromise;
    const db = client.db('yatayat');
    
    // Drop the problematic username index
    try {
      await db.collection('users').dropIndex('username_1');
      console.log('Dropped username_1 index successfully');
    } catch (error) {
      console.log('Username index not found or already dropped');
    }
    
    // Remove username field from existing documents
    await db.collection('users').updateMany(
      {},
      { $unset: { username: "" } }
    );
    console.log('Removed username field from existing users');
    
    // Ensure unique index on email
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('Created unique index on email field');
    } catch (error) {
      console.log('Email index already exists');
    }
    
    console.log('Database fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabaseIndex();