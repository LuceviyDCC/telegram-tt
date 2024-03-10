import axios from 'axios';

import { AXIOS_AUTH_TOKEN, AXIOS_BASE_URL } from '../config';

const instance = axios.create();

instance.defaults.baseURL = AXIOS_BASE_URL;

instance.interceptors.request.use((config) => {
  if (config.url !== '/apis/v1/auto_user_login') {
    const AUTH_TOKEN = localStorage.getItem(AXIOS_AUTH_TOKEN);

    if (AUTH_TOKEN) {
      config.headers.Authorization = `Basic ${AUTH_TOKEN}`;
    }
  }
  return config;
});

instance.interceptors.response.use((res) => {
  const { data } = res;

  if (data?.result?.code && data?.result?.data) {
    return data.result.data;
  }

  return res;
});

export default instance;



