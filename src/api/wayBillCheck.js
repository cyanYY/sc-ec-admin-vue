import axios from '@/utils/request'

export function listPage(params) {
  const url = '/wayBillCheck/listPage'
  return axios.post(url, params).then(res => res.data)
}

export function upload(params) {
  const url = '/wayBillCheck/upload'
  return axios.post(url, params).then(res => res.data)
}
