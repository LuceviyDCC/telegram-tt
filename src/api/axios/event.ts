import type { EventInfo } from '../../components/left/aigram/event/EventList';

import request from '../request';

export function getEventCategoryList() {
  return request.get<any, {
    list: Array<{
      ID: number;
      Name: string;
    }>;
  }>('/apis/v1/label/get_label_list');
}

export function getRecommendList() {
  return request.get<any, {
    list: EventInfo[];
  }>('/apis/v1/recommend/get_recommend_list');
}

export function getEventList(params: {
  keyword: string;
  offset: number;
  limit?: number;
}) {
  return request.post<any, {
    total: number;
    list: EventInfo[];
  }>('/apis/v1/assignment/get_assignment_list', {
    limit: 20,
    ...params,
  });
}
