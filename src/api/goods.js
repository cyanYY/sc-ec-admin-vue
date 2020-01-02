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
