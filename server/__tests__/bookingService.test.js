const BookingService = require('../services/bookingService');
const mongoose = require('mongoose');

// Mock MongoDB model
const mockBookingModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  countDocuments: jest.fn(),
  prototype: {
    save: jest.fn(),
    toObject: jest.fn()
  }
};

// Mock constructor function for Booking model
function MockBooking(data) {
  this.data = data;
  this._id = new mongoose.Types.ObjectId();
  this.createdAt = new Date();
  this.updatedAt = new Date();
  
  this.save = jest.fn().mockResolvedValue(this);
  this.toObject = jest.fn().mockReturnValue({
    ...this.data,
    _id: this._id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  });
  
  // Copy data properties to this object
  Object.assign(this, data);
}

// Mock service data provider
const mockServiceData = {
  getServiceById: jest.fn(),
  getBarberById: jest.fn()
};

describe('BookingService', () => {
  let bookingService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    bookingService = new BookingService(MockBooking, mockServiceData);
    
    // Mock mongoose ObjectId validation
    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
  });

  describe('createBooking', () => {
    const mockBookingData = {
      customerId: '648f1234567890abcdef1234',
      barberId: '648f1234567890abcdef5678',
      serviceId: '648f1234567890abcdef9abc',
      date: '2025-07-06',
      time: '10:00',
      specialRequests: 'Test booking'
    };

    it('should create a booking successfully', async () => {
      // Mock service data
      mockServiceData.getServiceById.mockResolvedValue({
        _id: mockBookingData.serviceId,
        name: 'Test Service',
        price: 50,
        duration: 30
      });
      
      mockServiceData.getBarberById.mockResolvedValue({
        _id: mockBookingData.barberId,
        name: 'Test Barber',
        profilePhoto: '/test.jpg'
      });

      const result = await bookingService.createBooking(mockBookingData);

      expect(result).toBeDefined();
      expect(result.customerId).toBe(mockBookingData.customerId);
      expect(result.barberId).toBe(mockBookingData.barberId);
      expect(result.serviceId).toBe(mockBookingData.serviceId);
      expect(result.date).toBe(mockBookingData.date);
      expect(result.time).toBe(mockBookingData.time);
      expect(result.status).toBe('pending');
      expect(result.totalPrice).toBe(50);
    });

    it('should throw error for missing required fields', async () => {
      const incompleteData = {
        customerId: '648f1234567890abcdef1234',
        barberId: '648f1234567890abcdef5678'
        // Missing serviceId, date, time
      };

      await expect(bookingService.createBooking(incompleteData))
        .rejects.toThrow('Missing required fields: customerId, barberId, serviceId, date, time');
    });

    it('should throw error for invalid ObjectId format', async () => {
      const invalidData = {
        ...mockBookingData,
        customerId: 'invalid-id'
      };

      // Mock invalid ObjectId
      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await expect(bookingService.createBooking(invalidData))
        .rejects.toThrow('Invalid customerId format');
    });

    it('should use default price when service not found', async () => {
      mockServiceData.getServiceById.mockRejectedValue(new Error('Service not found'));
      mockServiceData.getBarberById.mockResolvedValue({
        _id: mockBookingData.barberId,
        name: 'Test Barber'
      });

      const result = await bookingService.createBooking(mockBookingData);

      expect(result.totalPrice).toBe(50); // Default price
    });
  });

  describe('getBookingsByUser', () => {
    const userId = '648f1234567890abcdef1234';
    const mockBookings = [
      {
        _id: '648f1234567890abcdef1111',
        customerId: userId,
        barberId: '648f1234567890abcdef5678',
        serviceId: '648f1234567890abcdef9abc',
        date: '2025-07-06',
        time: '10:00',
        status: 'pending',
        toObject: () => ({
          _id: '648f1234567890abcdef1111',
          customerId: userId,
          barberId: '648f1234567890abcdef5678',
          serviceId: '648f1234567890abcdef9abc',
          date: '2025-07-06',
          time: '10:00',
          status: 'pending'
        })
      }
    ];

    beforeEach(() => {
      MockBooking.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockBookings)
            })
          })
        })
      });
      
      MockBooking.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(1)
      });

      mockServiceData.getServiceById.mockResolvedValue({
        name: 'Test Service',
        price: 50
      });
      
      mockServiceData.getBarberById.mockResolvedValue({
        name: 'Test Barber'
      });
    });

    it('should get bookings for a user successfully', async () => {
      const result = await bookingService.getBookingsByUser(userId);

      expect(result).toBeDefined();
      expect(result.bookings).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should apply filters correctly', async () => {
      const filters = {
        status: 'confirmed',
        date: '2025-07-06',
        barberId: '648f1234567890abcdef5678'
      };

      await bookingService.getBookingsByUser(userId, filters);

      expect(MockBooking.find).toHaveBeenCalledWith({
        customerId: userId,
        status: 'confirmed',
        date: '2025-07-06',
        barberId: '648f1234567890abcdef5678'
      });
    });
  });

  describe('cancelBooking', () => {
    const bookingId = '648f1234567890abcdef1111';
    const userId = '648f1234567890abcdef1234';

    it('should cancel a booking successfully', async () => {
      const mockCancelledBooking = {
        _id: bookingId,
        customerId: userId,
        status: 'cancelled',
        toObject: () => ({
          _id: bookingId,
          customerId: userId,
          status: 'cancelled'
        })
      };

      MockBooking.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCancelledBooking)
      });

      const result = await bookingService.cancelBooking(bookingId, userId);

      expect(result).toBeDefined();
      expect(result.status).toBe('cancelled');
      expect(MockBooking.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: bookingId, customerId: userId },
        { status: 'cancelled' },
        { new: true }
      );
    });

    it('should return null if booking not found', async () => {
      MockBooking.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      const result = await bookingService.cancelBooking(bookingId, userId);

      expect(result).toBeNull();
    });
  });

  describe('updateBooking', () => {
    const bookingId = '648f1234567890abcdef1111';
    const userId = '648f1234567890abcdef1234';
    const updateData = {
      date: '2025-07-07',
      time: '11:00',
      status: 'confirmed'
    };

    it('should update a booking successfully', async () => {
      const mockExistingBooking = {
        _id: bookingId,
        customerId: userId,
        serviceId: '648f1234567890abcdef9abc'
      };

      const mockUpdatedBooking = {
        ...mockExistingBooking,
        ...updateData,
        toObject: () => ({
          ...mockExistingBooking,
          ...updateData
        })
      };

      MockBooking.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockExistingBooking)
      });

      MockBooking.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedBooking)
      });

      mockServiceData.getServiceById.mockResolvedValue({
        name: 'Test Service',
        price: 50
      });
      
      mockServiceData.getBarberById.mockResolvedValue({
        name: 'Test Barber'
      });

      const result = await bookingService.updateBooking(bookingId, userId, updateData);

      expect(result).toBeDefined();
      expect(result.date).toBe(updateData.date);
      expect(result.time).toBe(updateData.time);
      expect(result.status).toBe(updateData.status);
    });

    it('should return null if booking not found', async () => {
      MockBooking.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      const result = await bookingService.updateBooking(bookingId, userId, updateData);

      expect(result).toBeNull();
    });
  });
});
