import axios from 'axios';
import { getGlobal } from '../global';

import { AXIOS_AUTH_TOKEN, AXIOS_BASE_URL } from '../config';
import { selectUser } from '../global/selectors';

const instance = axios.create();

instance.defaults.baseURL = AXIOS_BASE_URL;

instance.interceptors.request.use(async (config) => {
  if (config.url !== '/apis/v1/auto_user_login' && config.url !== '/apis/v1/statistics/login_report') {
    let AUTH_TOKEN = localStorage.getItem(AXIOS_AUTH_TOKEN);

    if (!AUTH_TOKEN) {
      const res = await login();

      AUTH_TOKEN = res.bearer_token;
      localStorage.setItem(AXIOS_AUTH_TOKEN, AUTH_TOKEN!);
    }

    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
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

let LOGIN_PROMISE: Promise<{
    bearer_token: string;
}> | undefined;

export function login() {
  const global = getGlobal();

  if (!global.currentUserId) {
    return Promise.reject();
  }

  const currentUser = selectUser(global, global.currentUserId);

  if (!LOGIN_PROMISE) {
    LOGIN_PROMISE = instance.post<any, {
      bearer_token: string;
    }>('/apis/v1/auto_user_login', {
      invite_code: global.inviteCode,
      platform: 'h',
      app_id: 'ai',

      phone: currentUser?.phoneNumber || '',
      tg_name: currentUser?.usernames?.[0]?.username || '',
      tg_id: currentUser?.id || ''
    });

    LOGIN_PROMISE.then(() => {
      LOGIN_PROMISE = undefined;
    });
  }

  return LOGIN_PROMISE;
}

export default instance;



