import mainApiService from '@/services/mainApiService';

export const handleDeconv2D = async (params) => {
  return await mainApiService.post('/image/deconv2D', params);
};
