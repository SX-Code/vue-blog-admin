import request from '@/utils/request'

export function fetchList() {
  return request({
    url: 'blog/type/list',
    method: 'get'
  })
}

export function addType(data) {
  return request({
    url: 'blog/type/add',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: 'blog/type/update',
    method: 'put',
    data
  })
}

export function removeType(id) {
  return request({
    url: 'blog/type/delete/' + id,
    method: 'delete'
  })
}
