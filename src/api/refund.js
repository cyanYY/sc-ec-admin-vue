import axios from '@/utils/request'

export function listPage(params) {
  const url = '/wayBillRefund/listPage'
  return axios.post(url, params).then(res => res.data)
}

export function add(params) {
  const url = '/wayBillRefund/add'
  return axios.post(url, params).then(res => res.data)
}
