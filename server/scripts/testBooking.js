#!/usr/bin/env node

const { connectDB } = require('../config/database');
const container = require('../services');

const testBooking = async () => {
  try {
    console.log('🧪 Testing booking creation...');
    
    // Connect to database
    await connectDB();
    
    const userService = container.get('userService');
    const bookingService = container.get('bookingService');
    
    // Get a user
    const user = await userService.getByEmail('customer1@example.com');
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email, 'ID:', user._id);
    
    // Test booking creation
    const bookingData = {
      customerId: user._id.toString(),
      barberId: '68696571268ef89f561f7086',
      serviceId: '68696571268ef89f561f707f',
      date: '2025-07-06',
      time: '10:00',
      specialRequests: 'Test booking'
    };
    
    console.log('📝 Creating booking with data:', bookingData);
    
    const booking = await bookingService.createBooking(bookingData);
    console.log('✅ Booking created successfully:', booking);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
};

testBooking();
