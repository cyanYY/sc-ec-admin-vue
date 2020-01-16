import axios from '@/utils/request'

export function listPage(params) {
  const url = '/goods/listPage'
  return axios.post(url, params).then(res => res.data)
}

export function add(params) {
  const url = '/goods/add'
  return axios.post(url, params).then(res => res.data)
}

export function update(params) {
  const url = '/goods/update'
  return axios.post(url, params).then(res => res.data)
}

export function addSender(params) {
  const url = '/goods/addSender'
  return axios.post(url, params).then(res => res.data)
}

export function updateSender(params) {
  const url = '/goods/updateSender'
  return axios.post(url, params).then(res => res.data)
}

export function deleteSender(params) {
  const url = '/goods/deleteSender?id=' + params.id
  return axios.get(url).then(res => res.data)
}
