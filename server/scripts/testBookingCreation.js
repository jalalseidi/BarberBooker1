#!/usr/bin/env node

/**
 * Test Booking Creation Script
 * 
 * This script tests booking creation with proper ObjectId references
 * to ensure the database relationships work correctly.
 * 
 * Usage: node scripts/testBookingCreation.js
 */

const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Database connection
require('../config/database');

const testBookingCreation = async () => {
  try {
    console.log('🧪 Testing booking creation with ObjectIds...');

    // Get existing users, barbers, and services
    const users = await User.find({}).limit(1);
    const barbers = await Barber.find({ isAvailable: true }).limit(1);
    const services = await Service.find({ isActive: true }).limit(1);

    if (users.length === 0 || barbers.length === 0 || services.length === 0) {
      console.log('❌ Missing test data. Please run the seed script first:');
      console.log('   npm run seed');
      return;
    }

    const customer = users[0];
    const barber = barbers[0];
    const service = services[0];

    console.log('📋 Test data found:');
    console.log(`  Customer: ${customer.email} (${customer._id})`);
    console.log(`  Barber: ${barber.name} (${barber._id})`);
    console.log(`  Service: ${service.name} (${service._id})`);

    // Create a test booking
    console.log('\n🔧 Creating test booking...');
    const testBooking = new Booking({
      customerId: customer._id,
      barberId: barber._id,
      serviceId: service._id,
      date: '2024-01-15',
      time: '10:00',
      specialRequests: 'Test booking created from script',
      totalPrice: service.price,
    });

    const savedBooking = await testBooking.save();

    console.log('✅ Booking created successfully!');
    console.log(`  Booking ID: ${savedBooking._id}`);
    console.log(`  Customer ID: ${savedBooking.customerId}`);
    console.log(`  Barber ID: ${savedBooking.barberId}`);
    console.log(`  Service ID: ${savedBooking.serviceId}`);
    console.log(`  Date: ${savedBooking.date}`);
    console.log(`  Time: ${savedBooking.time}`);
    console.log(`  Total Price: $${savedBooking.totalPrice}`);

    // Test population (if needed)
    console.log('\n🔗 Testing population...');
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('customerId', 'email')
      .populate('barberId', 'name email')
      .populate('serviceId', 'name price duration');

    if (populatedBooking) {
      console.log('✅ Population works correctly!');
      console.log(`  Customer: ${populatedBooking.customerId.email}`);
      console.log(`  Barber: ${populatedBooking.barberId.name}`);
      console.log(`  Service: ${populatedBooking.serviceId.name} - $${populatedBooking.serviceId.price}`);
    }

    // Clean up test booking
    await Booking.findByIdAndDelete(savedBooking._id);
    console.log('\n🧹 Test booking cleaned up');

    console.log('\n🎉 All tests passed! ObjectId relationships are working correctly.');

  } catch (error) {
    console.error('❌ Error testing booking creation:', error);
    
    if (error.name === 'ValidationError') {
      console.log('\n💡 This is likely due to invalid ObjectId references.');
      console.log('   Make sure to run the seed script first: npm run seed');
    }
  } finally {
    await mongoose.disconnect();
    console.log('📱 Database connection closed');
    process.exit(0);
  }
};

// Handle script execution
if (require.main === module) {
  testBookingCreation();
}

module.exports = { testBookingCreation };
