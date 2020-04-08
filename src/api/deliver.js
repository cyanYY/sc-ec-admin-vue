import axios from '@/utils/request'

export function deliverStatistic(params) {
  const url = '/deliver/deliverStatistic'
  return axios.post(url, params).then(res => res.data)
}

export function deliverDetail(params) {
  const url = '/deliver/deliverDetail'
  return axios.post(url, params).then(res => res.data)
}

export function listToDeliver(params) {
  const url = '/deliver/listToDeliver'
  return axios.post(url, params).then(res => res.data)
}

export function getBuyDetail(params) {
  const url = '/deliver/getBuyDetail'
  return axios.post(url, params).then(res => res.data)
}

export function importBuyDetail(params) {
  const url = '/deliver/importBuyDetail'
  return axios.post(url, params).then(res => res.data)
}

export function getProcurement(params) {
  const url = '/deliver/getProcurement'
  return axios.post(url, params).then(res => res.data)
}

export function importProcurement(params) {
  const url = '/deliver/importProcurement'
  return axios.post(url, params).then(res => res.data)
}

export function addBuyDetail(params) {
  const url = '/deliver/addBuyDetail'
  return axios.post(url, params).then(res => res.data)
}

export function addProcurement(params) {
  const url = '/deliver/addProcurement'
  return axios.post(url, params).then(res => res.data)
}

export function updateBuyDetail(params) {
  const url = '/deliver/updateBuyDetail'
  return axios.post(url, params).then(res => res.data)
}

export function deleteBuyDetail(params) {
  const url = '/deliver/deleteBuyDetail'
  return axios.post(url, params).then(res => res.data)
}

export function updateProcurement(params) {
  const url = '/deliver/updateProcurement'
  return axios.post(url, params).then(res => res.data)
}

export function deleteProcurement(params) {
  const url = '/deliver/deleteProcurement'
  return axios.post(url, params).then(res => res.data)
}
