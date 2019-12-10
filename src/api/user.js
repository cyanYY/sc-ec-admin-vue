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

export function updatePwd(params) {
  const url = '/user/updatePwd'
  return request.post(url, params).then(res => res.data)
}

// 添加用户
export function userAdd(params) {
  const url = '/user/add'
  return request.post(url, params).then(res => res.data)
}

// 删除用户
export function userDelete(params) {
  const url = '/user/delete?id=' + params.id
  return request.get(url).then(res => res.data)
}

// 分页查询用户
export function userListPage(params) {
  const url = '/user/listPage'
  return request.post(url, params).then(res => res.data)
}

// 修改用户
export function userUpdate(params) {
  const url = '/user/update'
  return request.post(url, params).then(res => res.data)
}

// 查询代理商下拉列表
export function listAgents() {
  const url = '/user/listAgents'
  return request.get(url).then(res => res.data)
}

// 查询商户下拉列表
export function listMerchants(params) {
  const url = '/user/listMerchants?agentId=' + params.agentId
  return request.get(url).then(res => res.data)
}
