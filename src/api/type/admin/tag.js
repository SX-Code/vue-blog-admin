import request from '@/utils/request'

export function fetchList() {
  return request({
    url: 'blog/tag/list',
    method: 'get'
  })
}

export function addTag(data) {
  return request({
    url: 'blog/tag/add',
    method: 'post',
    data
  })
}

export function updateTag(data) {
  return request({
    url: 'blog/tag/update',
    method: 'put',
    data
  })
}

export function removeTag(id) {
  return request({
    url: 'blog/tag/delete/' + id,
    method: 'delete'
  })
}
