import express from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; } },
  role: { type: String, enum: ['citizen', 'police', 'admin'], required: true },
  fullName: { type: String, required: true },
  vehicleNumbers: [String],
  officerId: String,
  googleId: String,
  profilePicture: String,
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  status: { type: String, default: function() { return this.role === 'police' ? 'Pending' : 'Active'; } },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Register route
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request:', req.body);
    const { email, password, role, fullName, vehicleNumbers, officerId } = req.body;
    
    // Validation
    if (!email || !password || !role || !fullName) {
      console.log('Missing required fields:', { email: !!email, password: !!password, role: !!role, fullName: !!fullName });
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if user exists
    console.log('Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user object
    const userData = {
      email,
      password: hashedPassword,
      role,
      fullName
    };
    
    // Add role-specific fields
    if (role === 'citizen' && vehicleNumbers) {
      userData.vehicleNumbers = vehicleNumbers;
    }
    if (role === 'police' && officerId) {
      userData.officerId = officerId;
    }
    
    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
    const user = new User(userData);
    
    console.log('Saving user to database...');
    await user.save();
    console.log('User registered successfully:', email);
    
    res.status(201).json({ 
      message: 'Registration successful',
      user: { email, role, fullName, vehicleNumbers: userData.vehicleNumbers, officerId: userData.officerId }
    });
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google authentication route
app.post('/api/google-auth', async (req, res) => {
  try {
    const { credential, role } = req.body;
    
    // Decode Firebase ID token (basic decode for demo - in production use Firebase Admin SDK)
    const payload = jwt.decode(credential);
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Firebase token' });
    }

    const { email, name, picture } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email, role });
    
    if (!user) {
      // Create new user
      const userData = {
        email,
        fullName: name,
        role,
        googleId: payload.sub,
        profilePicture: picture,
        status: role === 'police' ? 'Pending' : 'Active',
        createdAt: new Date(),
        authProvider: 'google'
      };
      
      user = new User(userData);
      await user.save();
    }
    
    // Check if police account is verified
    if (user.role === 'police' && user.status === 'Pending') {
      return res.status(400).json({ message: 'Your police account is pending admin verification. Please contact admin.' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if police account is verified
    if (user.role === 'police' && user.status === 'Pending') {
      return res.status(400).json({ message: 'Your police account is pending admin verification. Please contact admin.' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        vehicleNumbers: user.vehicleNumbers,
        officerId: user.officerId,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user status
app.put('/api/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Consolidated endpoint for vehicles
app.all('/api/consolidated', async (req, res) => {
  try {
    const { endpoint } = req.query;
    
    if (endpoint === 'vehicles') {
      if (req.method === 'GET') {
        const { userId } = req.query;
        if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
        }
        
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        return res.json({ vehicles: user.vehicleNumbers || [] });
      }
      
      if (req.method === 'POST') {
        const { userId, vehicleNumber } = req.body;
        if (!userId || !vehicleNumber) {
          return res.status(400).json({ message: 'User ID and vehicle number are required' });
        }
        
        await User.findByIdAndUpdate(userId, {
          $addToSet: { vehicleNumbers: vehicleNumber.toUpperCase() }
        });
        
        return res.json({ message: 'Vehicle added successfully' });
      }
      
      if (req.method === 'DELETE') {
        const { userId, vehicleNumber } = req.body;
        if (!userId || !vehicleNumber) {
          return res.status(400).json({ message: 'User ID and vehicle number are required' });
        }
        
        await User.findByIdAndUpdate(userId, {
          $pull: { vehicleNumbers: vehicleNumber }
        });
        
        return res.json({ message: 'Vehicle removed successfully' });
      }
    }
    
    return res.status(404).json({ message: 'Endpoint not found' });
  } catch (error) {
    console.error('Consolidated API error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});