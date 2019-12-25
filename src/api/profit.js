import axios from '@/utils/request'

// 查询处理数据列表
export function listPage(params) {
  const url = '/profit/listPage'
  return axios.post(url, params).then(res => res.data)
}

export function editCost(params) {
  const url = '/profit/editCost'
  return axios.post(url, params).then(res => res.data)
}
