// import { AXIOS_LOG_URL } from '../../config';
// import request from '../request';

export function login(data: {
  phone: string;
  tg_name: string;
  tg_id: string;
  invite_code?: string;
}) {
  // eslint-disable-next-line no-console
  console.log(data);
  return undefined;
  // return request.post('/apis/v1/auto_user_login', {
  //   ...data,
  //   'platform': 'h',
  //   'app_id': 'ai'
  // });
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum LOGIN_LOG_ERROR_TYPE {
  SUCESS = '0',
  ERROR = '1',
  PRE_LOGIN = '3',
}

export function logLoginInfo (data: {
  'area_code': string;
  'phone': string;
  'error_type': LOGIN_LOG_ERROR_TYPE;
}) {
  // eslint-disable-next-line no-console
  console.log(data);
  return undefined;
  // return request.post('/apis/v1/statistics/login_report', {
  //   ...data,
  //   is_new: '1',
  //   login_type: '2',
  // }, {
  //   baseURL: AXIOS_LOG_URL,
  // });
}
