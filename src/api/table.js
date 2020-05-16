import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/blog/list',
    method: 'get',
    params
  })
}
