import request from '@/utils/request'

export function fetchList() {
  return request({
    url: 'admin/type/list',
    method: 'get'
  })
}

export function addType(data) {
  return request({
    url: 'admin/type/add',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: 'admin/type/update',
    method: 'put',
    data
  })
}

export function removeType(id) {
  return request({
    url: 'admin/type/delete/' + id,
    method: 'delete'
  })
}
