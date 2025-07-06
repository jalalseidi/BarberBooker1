#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const { connectDB } = require('../config/database');
const container = require('../services');

const testJWT = async () => {
  try {
    console.log('🔍 Testing JWT token validation...');
    
    // Connect to database
    await connectDB();
    
    const userService = container.get('userService');
    
    // Login and get token
    const user = await userService.authenticateWithPassword('customer1@example.com', 'password123');
    if (!user) {
      console.log('❌ Authentication failed');
      return;
    }
    
    console.log('✅ User authenticated:', user.email);
    
    // Generate token
    const payload = {
      sub: user._id
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('🔑 Generated token:', token);
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified:', decoded);
      
      // Get user by decoded ID
      const fetchedUser = await userService.get(decoded.sub);
      if (fetchedUser) {
        console.log('✅ User found from token:', fetchedUser.email);
      } else {
        console.log('❌ User not found from token');
      }
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
};

testJWT();
