import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString from 'query-string';
import { appInfo } from '../constants/appInfos';

const axiosClient = axios.create({
  baseURL: appInfo.BASE_URL,
  paramsSerializer: params => queryString.stringify(params),
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config: any) => {
  config.headers = {
    Authorization: '',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...config.headers,
  };

  return config;
});

axiosClient.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data && res.status === 200) {
      return res.data;
    }
    throw new Error('Error');
  },
  (error: any) => {
    console.log(`Error api ${JSON.stringify(error)}`);
    if (error.response) {
      throw error.response.data || error.response;
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    } else {
      throw new Error(error.message || 'Đã xảy ra lỗi');
    }
  },
);

export default (url: string, options?: AxiosRequestConfig) => {
  return axiosClient(url, options);
};