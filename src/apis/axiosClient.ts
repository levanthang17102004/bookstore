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
      // Server responded with error status
      const errorData = error.response.data || {};
      const errorMessage = errorData.message || error.response.statusText || 'Đã xảy ra lỗi';
      const errorObj = {
        ...errorData,
        message: errorMessage,
        statusCode: error.response.status,
      };
      throw errorObj;
    } else if (error.request) {
      // Request was made but no response received
      throw {
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        statusCode: 0,
      };
    } else {
      // Something else happened
      throw {
        message: error.message || 'Đã xảy ra lỗi',
        statusCode: 0,
      };
    }
  },
);

export default (url: string, options?: AxiosRequestConfig) => {
  return axiosClient(url, options);
};