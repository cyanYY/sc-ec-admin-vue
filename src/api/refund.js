import axios from '@/utils/request'

export function listPage(params) {
  const url = '/wayBillRefund/listPage'
  return axios.post(url, params).then(res => res.data)
}

export function add(params) {
  const url = '/wayBillRefund/add'
  return axios.post(url, params).then(res => res.data)
}

export function getGroupPanelInfo(params) {
  const url = '/wayBillRefund/getGroupPanelInfo'
  return axios.post(url, params).then(res => res.data)
}

export function queryAfterSale(params) {
  const url = '/refund/queryAfterSale'
  return axios.post(url, params).then(res => res.data)
}

export function queryAfterSaleLogs(params) {
  const url = '/refund/queryAfterSaleLogs'
  return axios.post(url, params).then(res => res.data)
}

export function offlineAfterSale(params) {
  const url = '/refund/offlineAfterSale'
  return axios.post(url, params).then(res => res.data)
}
