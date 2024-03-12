import request from '../request';

export function getTaskInfo() {
  return request.get<any, {
    id: number;
    invite_code: string;
    total_score: number;
  }>('/apis/v1/task/get_user_task_info');
}

export function getTaskList() {
  return request.get<any, {
    id: number;
    invite_code: string;
    total_score: number;
  }>('/apis/v1/task/get_user_task_list');
}
