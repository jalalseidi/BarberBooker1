#!/usr/bin/env node

const { connectDB } = require('../config/database');
const container = require('../services');

const testDirectBooking = async () => {
  try {
    console.log('🧪 Testing direct booking creation with proper ObjectIds...');
    
    // Connect to database
    await connectDB();
    
    const bookingService = container.get('bookingService');
    
    // Test booking creation with proper ObjectIds from the seeded data
    const bookingData = {
      customerId: '6869709bdf2c13fec3e8cae6', // Use the user ID from login
      barberId: '68696fe437531544b57ccf1b',    // From seed output
      serviceId: '68696fe437531544b57ccf15',   // From seed output (Beard Trim)
      date: '2025-07-06',
      time: '14:00',
      specialRequests: 'Test booking with proper ObjectIds'
    };
    
    console.log('📝 Creating booking with data:', bookingData);
    
    const booking = await bookingService.createBooking(bookingData);
    console.log('✅ Booking created successfully!');
    console.log('📋 Booking details:', {
      id: booking._id,
      service: booking.service?.name,
      barber: booking.barber?.name,
      date: booking.date,
      time: booking.time,
      price: booking.totalPrice
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
};

testDirectBooking();
