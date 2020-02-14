import axios from '@/utils/request'

export function listPage(params) {
  const url = '/orderService/listPage'
  return axios.post(url, params).then(res => res.data)
}

export function applyService(params) {
  const url = '/orderService/applyService'
  return axios.post(url, params).then(res => res.data)
}
