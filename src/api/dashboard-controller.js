import axios from '@/utils/request'

// 查询统计数据
export function getGroupPanelInfo() {
  const url = '/dashboard/getGroupPanelInfo'
  return axios.post(url).then(res => res.data)
}

// 查询用户处理数据列表
export function listUserHandle(params) {
  const url = '/dashboard/listUserHandle'
  return axios.post(url, params).then(res => res.data)
}
