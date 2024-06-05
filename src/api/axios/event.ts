import request from '../request';

export function getEventCategoryList() {
  return request.get<any, {
    list: Array<{
      ID: number;
      Name: string;
    }>;
  }>('/apis/v1/label/get_label_list');
}
