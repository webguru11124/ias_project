import axios from 'axios';
import { api, apiForm } from './base';
import store from '@/reducers';
import mainApiService from '@/services/mainApiService';

export const uploadMeasureData = async (data) => {
  let keyList = [];
  const formData = new FormData();

  for (const key in data) {
    keyList.push(key);
    // console.log(`${key} - ${JSON.stringify(data[key])}`);
    formData.append([key], JSON.stringify(data[key]));
    formData.append('keyList', key);
  }
  let response = await apiForm.post(
    'image/measure/update_measure_data',
    formData,
  );
  return response;
};
