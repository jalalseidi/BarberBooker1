// import api from './api';
// import { handleApiError } from './errorHandler';
import {
  ApiResponse,
  GetServicesResponseData,
  GetServiceByIdResponseData,
  GetServicesByCategoryResponseData,
  FilterParams
} from './types';

export interface Service {
  _id: string;
  name: string;
  nameEn: string;
  nameTr: string;
  description: string;
  descriptionEn: string;
  descriptionTr: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
}

/**
 * Get all available services
 * @param filters Optional filters for pagination, sorting, and filtering
 * @returns List of services with pagination info
 */
export const getServices = async (filters?: FilterParams): Promise<ApiResponse<GetServicesResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<GetServicesResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          services: [
            {
              _id: '1',
              name: 'Classic Haircut',
              nameEn: 'Classic Haircut',
              nameTr: 'Klasik Saç Kesimi',
              description: 'Professional haircut with styling',
              descriptionEn: 'Professional haircut with styling',
              descriptionTr: 'Şekillendirme ile profesyonel saç kesimi',
              duration: 30,
              price: 50,
              category: 'haircut',
              isActive: true
            },
            {
              _id: '2',
              name: 'Beard Trim',
              nameEn: 'Beard Trim',
              nameTr: 'Sakal Düzeltme',
              description: 'Professional beard trimming and shaping',
              descriptionEn: 'Professional beard trimming and shaping',
              descriptionTr: 'Profesyonel sakal kesimi ve şekillendirme',
              duration: 20,
              price: 30,
              category: 'beard',
              isActive: true
            },
            {
              _id: '3',
              name: 'Classic Shave',
              nameEn: 'Classic Shave',
              nameTr: 'Klasik Tıraş',
              description: 'Traditional hot towel shave',
              descriptionEn: 'Traditional hot towel shave',
              descriptionTr: 'Geleneksel sıcak havlu tıraşı',
              duration: 25,
              price: 40,
              category: 'shave',
              isActive: true
            },
            {
              _id: '4',
              name: 'Hair Styling',
              nameEn: 'Hair Styling',
              nameTr: 'Saç Şekillendirme',
              description: 'Professional hair styling and finishing',
              descriptionEn: 'Professional hair styling and finishing',
              descriptionTr: 'Profesyonel saç şekillendirme ve bitirme',
              duration: 20,
              price: 35,
              category: 'styling',
              isActive: true
            },
            {
              _id: '5',
              name: 'Complete Package',
              nameEn: 'Complete Package',
              nameTr: 'Komple Paket',
              description: 'Haircut, beard trim, and styling',
              descriptionEn: 'Haircut, beard trim, and styling',
              descriptionTr: 'Saç kesimi, sakal düzeltme ve şekillendirme',
              duration: 60,
              price: 100,
              category: 'package',
              isActive: true
            }
          ],
          total: 5,
          page: 1,
          limit: 10
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/services', { 
  //     params: filters 
  //   });
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};

/**
 * Get a service by ID
 * @param serviceId ID of the service to retrieve
 * @returns Service details
 */
export const getServiceById = async (serviceId: string): Promise<ApiResponse<GetServiceByIdResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<GetServiceByIdResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          service: {
            _id: serviceId,
            name: 'Classic Haircut',
            nameEn: 'Classic Haircut',
            nameTr: 'Klasik Saç Kesimi',
            description: 'Professional haircut with styling',
            descriptionEn: 'Professional haircut with styling',
            descriptionTr: 'Şekillendirme ile profesyonel saç kesimi',
            duration: 30,
            price: 50,
            category: 'haircut',
            isActive: true
          }
        }
      });
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/services/${serviceId}`);
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};

/**
 * Get services by category
 * @param category Category to filter services by
 * @param filters Optional filters for pagination, sorting, and filtering
 * @returns List of services in the specified category
 */
export const getServicesByCategory = async (
  category: string,
  filters?: FilterParams
): Promise<ApiResponse<GetServicesByCategoryResponseData>> => {
  // Mocking the response
  return new Promise<ApiResponse<GetServicesByCategoryResponseData>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          services: [
            {
              _id: '1',
              name: 'Classic Haircut',
              nameEn: 'Classic Haircut',
              nameTr: 'Klasik Saç Kesimi',
              description: 'Professional haircut with styling',
              descriptionEn: 'Professional haircut with styling',
              descriptionTr: 'Şekillendirme ile profesyonel saç kesimi',
              duration: 30,
              price: 50,
              category: category,
              isActive: true
            }
          ],
          category: category,
          total: 1
        }
      });
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/services/category/${category}`, { 
  //     params: filters 
  //   });
  //   return response.data;
  // } catch (error) {
  //   throw handleApiError(error);
  // }
};
