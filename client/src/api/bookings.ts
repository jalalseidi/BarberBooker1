// Uncomment these imports when switching to real API calls
// import api from './api';
// import { handleApiError } from './errorHandler';

import { 
  ApiResponse, 
  GetBookingsResponseData, 
  CreateBookingRequest,
  CreateBookingResponseData, 
  CancelBookingResponseData,
  GetBookingByIdResponseData,
  FilterParams
} from './types';

export interface Booking {
  _id: string;
  customerId: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  specialRequests?: string;
  totalPrice: number;
  createdAt: string;
  barber: {
    name: string;
    profilePhoto: string;
  };
  service: {
    name: string;
    nameEn: string;
    nameTr: string;
    duration: number;
    price: number;
  };
}

/**
 * Get user's bookings
 * @param filters Optional filters for pagination, sorting, and filtering
 * @returns List of user's bookings with pagination info
 */
export const getBookings = async (_filters?: FilterParams): Promise<ApiResponse<GetBookingsResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<GetBookingsResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          bookings: [
            {
              _id: '1',
              customerId: 'user1',
              barberId: '1',
              serviceId: '1',
              date: '2024-01-15',
              time: '10:00',
              status: 'confirmed',
              specialRequests: 'Please use scissors only',
              totalPrice: 50,
              createdAt: '2024-01-10T10:00:00Z',
              barber: {
                name: 'Mehmet Özkan',
                profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
              },
              service: {
                name: 'Classic Haircut',
                nameEn: 'Classic Haircut',
                nameTr: 'Klasik Saç Kesimi',
                duration: 30,
                price: 50
              }
            },
            {
              _id: '2',
              customerId: 'user1',
              barberId: '2',
              serviceId: '2',
              date: '2024-01-20',
              time: '14:30',
              status: 'pending',
              totalPrice: 30,
              createdAt: '2024-01-12T15:30:00Z',
              barber: {
                name: 'Ali Demir',
                profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              },
              service: {
                name: 'Beard Trim',
                nameEn: 'Beard Trim',
                nameTr: 'Sakal Düzeltme',
                duration: 20,
                price: 30
              }
            }
          ],
          total: 2,
          page: 1,
          limit: 10
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/bookings', { 
  //     params: filters 
  //   });
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};

/**
 * Create a new booking
 * @param data Booking data
 * @returns Created booking and success message
 */
export const createBooking = async (data: CreateBookingRequest): Promise<ApiResponse<CreateBookingResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<CreateBookingResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Booking created successfully',
        data: {
          booking: {
            _id: Date.now().toString(),
            customerId: 'user1',
            barberId: data.barberId,
            serviceId: data.serviceId,
            date: data.date,
            time: data.time,
            status: 'confirmed',
            specialRequests: data.specialRequests,
            totalPrice: 50,
            createdAt: new Date().toISOString(),
            barber: {
              name: 'Mehmet Özkan',
              profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            },
            service: {
              name: 'Classic Haircut',
              nameEn: 'Classic Haircut',
              nameTr: 'Klasik Saç Kesimi',
              duration: 30,
              price: 50
            }
          },
          message: 'Booking created successfully'
        }
      });
    }, 1000);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/bookings', data);
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};

/**
 * Update an existing booking
 * @param bookingId ID of the booking to update
 * @param data Updated booking data
 * @returns Updated booking details
 */
export const updateBooking = async (bookingId: string, data: Partial<CreateBookingRequest>): Promise<ApiResponse<CreateBookingResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<CreateBookingResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Booking updated successfully',
        data: {
          booking: {
            _id: bookingId,
            customerId: 'user1',
            barberId: data.barberId || '1',
            serviceId: data.serviceId || '1',
            date: data.date || '2024-01-15',
            time: data.time || '10:00',
            status: 'confirmed',
            specialRequests: data.specialRequests,
            totalPrice: 50,
            createdAt: new Date().toISOString(),
            barber: {
              name: 'Mehmet Özkan',
              profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            },
            service: {
              name: 'Classic Haircut',
              nameEn: 'Classic Haircut',
              nameTr: 'Klasik Saç Kesimi',
              duration: 30,
              price: 50
            }
          },
          message: 'Booking updated successfully'
        }
      });
    }, 1000);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.put(`/api/bookings/${bookingId}`, data);
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};

/**
 * Cancel a booking
 * @param bookingId ID of the booking to cancel
 * @returns Success message and booking ID
 */
export const cancelBooking = async (bookingId: string): Promise<ApiResponse<CancelBookingResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<CancelBookingResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          message: 'Booking cancelled successfully',
          bookingId: bookingId
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.delete(`/api/bookings/${bookingId}`);
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};

/**
 * Get a booking by ID
 * @param bookingId ID of the booking to retrieve
 * @returns Booking details
 */
export const getBookingById = async (bookingId: string): Promise<ApiResponse<GetBookingByIdResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<GetBookingByIdResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          booking: {
            _id: bookingId,
            customerId: 'user1',
            barberId: '1',
            serviceId: '1',
            date: '2024-01-15',
            time: '10:00',
            status: 'confirmed',
            specialRequests: 'Please use scissors only',
            totalPrice: 50,
            createdAt: '2024-01-10T10:00:00Z',
            barber: {
              name: 'Mehmet Özkan',
              profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            },
            service: {
              name: 'Classic Haircut',
              nameEn: 'Classic Haircut',
              nameTr: 'Klasik Saç Kesimi',
              duration: 30,
              price: 50
            }
          }
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/bookings/${bookingId}`);
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};
