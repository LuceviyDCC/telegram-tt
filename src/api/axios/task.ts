import request from '../request';

export function getTaskInfo() {
  return request.get<any, {
    id: number;
    invite_code: string;
    total_score: number;
  }>('/apis/v1/task/get_user_task_info');
}

export function getTaskList() {
  return request.get<any, Array<{
    finish_count: number;
    today_finished?: 0 | 1;
    task_info: {
      id: number;
      name: string;
      description: string;
      detail_url: string;
      icon: string;
      tip_text: string;
    };
  }>>('/apis/v1/task/get_user_task_list');
}

export function completeTask(taskId: number) {
  return request.post('/apis/v1/task/user_set_task', {
    task_id: taskId
  });
}

export function completeJoinTask(options: {
  group_url: string;
  phone: string;
  tg_name: string;
  nick_name: string;
}) {
  return request.post('/apis/v1/task/user_join_group', {
    ...options
  });
}

export function getScoreDetailList() {
  return request.get<any, Array<{
    created_at: string;
    current_score: number;
    id: number;
    score: number;
    task_id: number;
    updated_at: string;
    user_id: number;
  }>>('/apis/v1/task/get_user_task_log_list');
}
