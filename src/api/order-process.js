import axios from '@/utils/request'
// 分页查询运单列表
export function listPage(params) {
  const url = '/orderProcess/listPage'
  return axios.post(url, params).then(res => res.data)
}

// 导入运单
export function upload(params) {
  const url = '/orderProcess/upload'
  return axios.post(url, params).then(res => res.data)
}
// 处理异常运单
export function handle(params) {
  const url = '/orderProcess/handle'
  return axios.post(url, params).then(res => res.data)
}

// 挂起异常运单
export function hang(params) {
  const url = '/orderProcess/hang'
  return axios.post(url, params).then(res => res.data)
}
// 异常运单认领
export function claim(params) {
  const url = '/orderProcess/batchClaim'
  return axios.post(url, [params.orderNo]).then(res => res.data)
}

// 分页查询用户待处理运单列表
export function listUserTodo(params) {
  const url = '/orderProcess/listPageTodo'
  return axios.post(url, params).then(res => res.data)
}

// 分页查询用户已处理运单列表
export function listUserFinish(params) {
  const url = '/orderProcess/listPageFinish'
  return axios.post(url, params).then(res => res.data)
}
// 异常运单批量认领
export function batchClaim(params) {
  const url = '/orderProcess/batchClaim'
  return axios.post(url, params).then(res => res.data)
}

export function listPageTodo(params) {
  const url = '/orderProcess/listPageTodo'
  return axios.post(url, params).then(res => res.data)
}

export function listPageFinish(params) {
  const url = '/orderProcess/listPageFinish'
  return axios.post(url, params).then(res => res.data)
}
