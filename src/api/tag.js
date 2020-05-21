import request from '@/utils/request'

export function fetchTagList() {
  return request({
    url: 'admin/tag/list',
    method: 'get'
  })
}

export function addTag(data) {
  return request({
    url: 'admin/tag/add',
    method: 'post',
    data
  })
}

export function updateTag(data) {
  return request({
    url: 'admin/tag/update',
    method: 'put',
    data
  })
}

export function removeTag(id) {
  return request({
    url: 'admin/tag/delete/' + id,
    method: 'delete'
  })
}
