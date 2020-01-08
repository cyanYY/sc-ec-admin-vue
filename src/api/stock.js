import axios from '@/utils/request'

// 分页查询超时运单列表
export function listPageOvertime(params) {
  const url = '/stock/listPageOvertime'
  return axios.post(url, params).then(res => res.data)
}

export function listPage(params) {
  const url = '/stock/listPage'
  return axios.post(url, params).then(res => res.data)
}

export function updateStock(params) {
  const url = '/stock/updateStock'
  return axios.post(url, params).then(res => res.data)
}
