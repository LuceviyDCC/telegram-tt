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
    list: Array<EventInfo>;
  }>('/apis/v1/recommend/get_recommend_list');
}
