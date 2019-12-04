import request, { obj2Param } from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
    transformRequest: [obj2Param],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/user/getInfo',
    method: 'post'
  })
}
