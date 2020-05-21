import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/blog/list',
    method: 'get',
    params
  })
}

export function postPicture(data) {
  return request({
    url: '/admin/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function postBlog(params) {
  return request({
    url: '/admin/blog',
    type: 'post',
    params
  })
}
