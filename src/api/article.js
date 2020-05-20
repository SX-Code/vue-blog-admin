import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/blog',
    method: 'get',
    params
  })
}

export function fetchArticle(id) {
  return request({
    url: '/admin/blog/' + id,
    method: 'get'
  })
}

export function postArticle(data) {
  return request({
    url: '/admin/blog',
    method: 'post',
    data
  })
}

export function removeArticle(id) {
  return request({
    url: '/admin/blog/' + id,
    method: 'delete'
  })
}

export function updateRecommend(id, recommend) {
  return request({
    url: '/admin/blog/' + id,
    method: 'put',
    params: { id, recommend }
  })
}
