import mainApiService from '@/services/mainApiService';

export const processDeconv2D = async (params) => {
  return await mainApiService.post('/image/deconv2D', params);
};

export const processDeconv3D = async (params) => {
  return await mainApiService.post('/image/deconv3D', params);
};
