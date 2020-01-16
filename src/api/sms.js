import axios from '@/utils/request'

export function smsListPage(params) {
  const url = '/sms/smsListPage'
  return axios.post(url, params).then(res => res.data)
}

export function smsAdd(params) {
  const url = '/sms/addSms'
  return axios.post(url, params).then(res => res.data)
}

export function smsUpdate(params) {
  const url = '/sms/updateSms'
  return axios.post(url, params).then(res => res.data)
}

export function smsDelete(params) {
  const url = '/sms/deleteSms'
  return axios.post(url, params).then(res => res.data)
}
