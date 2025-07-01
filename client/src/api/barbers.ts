import {
  ApiResponse,
  GetBarbersResponseData,
  GetBarberByIdResponseData,
  GetBarberAvailabilityResponseData,
  FilterParams
} from './types';

export interface Barber {
  _id: string;
  name: string;
  email: string;
  specialties: string[];
  bio: string;
  bioEn: string;
  bioTr: string;
  profilePhoto: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  workingHours: {
    start: string;
    end: string;
  };
}

/**
 * Get all available barbers
 * @param filters Optional filters for pagination, sorting, and filtering
 * @returns List of barbers with pagination info
 */
export const getBarbers = async (filters?: FilterParams): Promise<ApiResponse<GetBarbersResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<GetBarbersResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          barbers: [
            {
              _id: '1',
              name: 'Mehmet Özkan',
              email: 'mehmet@barbershop.com',
              specialties: ['haircut', 'beard', 'styling'],
              bio: 'Expert barber with 10+ years experience',
              bioEn: 'Expert barber with 10+ years experience',
              bioTr: '10+ yıl deneyimli uzman berber',
              profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              rating: 4.8,
              reviewCount: 127,
              isAvailable: true,
              workingHours: {
                start: '09:00',
                end: '18:00'
              }
            },
            {
              _id: '2',
              name: 'Ali Demir',
              email: 'ali@barbershop.com',
              specialties: ['haircut', 'shave'],
              bio: 'Traditional barber specializing in classic cuts',
              bioEn: 'Traditional barber specializing in classic cuts',
              bioTr: 'Klasik kesimler konusunda uzmanlaşmış geleneksel berber',
              profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              rating: 4.6,
              reviewCount: 89,
              isAvailable: true,
              workingHours: {
                start: '10:00',
                end: '19:00'
              }
            },
            {
              _id: '3',
              name: 'Emre Kaya',
              email: 'emre@barbershop.com',
              specialties: ['styling', 'treatment'],
              bio: 'Modern styling expert and hair treatment specialist',
              bioEn: 'Modern styling expert and hair treatment specialist',
              bioTr: 'Modern şekillendirme uzmanı ve saç bakım uzmanı',
              profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
              rating: 4.9,
              reviewCount: 156,
              isAvailable: false,
              workingHours: {
                start: '08:00',
                end: '17:00'
              }
            }
          ],
          total: 3,
          page: 1,
          limit: 10
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/barbers', { 
  //     params: filters 
  //   });
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};

/**
 * Get barber availability for a specific date
 * @param barberId ID of the barber
 * @param date Date to check availability for
 * @param serviceId Optional service ID to check availability for specific service
 * @returns Available time slots for the barber on the specified date
 */
export const getBarberAvailability = async (
  barberId: string, 
  date: string,
  serviceId?: string
): Promise<ApiResponse<GetBarberAvailabilityResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<GetBarberAvailabilityResponseData>>((resolve) => {
    setTimeout(() => {
      const slots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
      resolve({
        success: true,
        data: {
          availableSlots: slots,
          date: date,
          barberId: barberId
        }
      });
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const params: GetBarberAvailabilityRequest = { date };
  //   if (serviceId) {
  //     params.serviceId = serviceId;
  //   }
  //   const response = await api.get(`/api/barbers/${barberId}/availability`, { 
  //     params 
  //   });
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};

/**
 * Get a barber by ID
 * @param barberId ID of the barber to retrieve
 * @returns Barber details
 */
export const getBarberById = async (barberId: string): Promise<ApiResponse<GetBarberByIdResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<GetBarberByIdResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          barber: {
            _id: barberId,
            name: 'Mehmet Özkan',
            email: 'mehmet@barbershop.com',
            specialties: ['haircut', 'beard', 'styling'],
            bio: 'Expert barber with 10+ years experience',
            bioEn: 'Expert barber with 10+ years experience',
            bioTr: '10+ yıl deneyimli uzman berber',
            profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            rating: 4.8,
            reviewCount: 127,
            isAvailable: true,
            workingHours: {
              start: '09:00',
              end: '18:00'
            }
          }
        }
      });
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/barbers/${barberId}`);
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};
