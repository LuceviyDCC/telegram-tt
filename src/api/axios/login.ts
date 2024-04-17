// import { AXIOS_LOG_URL } from '../../config';
// import { getGlobal } from "../../global";

import { AXIOS_LOG_URL } from "../../config";
import request from "../request";

// import { selectUser } from "../../global/selectors";
// import request from '../request';

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
  return request.post('/apis/v1/statistics/login_report', {
    ...data,
    is_new: '1',
    login_type: '2',
  }, {
    baseURL: AXIOS_LOG_URL,
  });
}
