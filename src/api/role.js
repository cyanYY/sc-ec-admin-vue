import axios from '@/utils/request'

// 添加角色
export function roleAdd(params) {
  const url = '/role/add'
  return axios.post(url, params).then(res => res.data)
}

// 删除角色
export function roleDelete(param) {
  const url = '/role/delete?id=' + param.id
  return axios.get(url).then(res => res.data)
}

// 查询角色下拉列表
export function roleListAll() {
  const url = '/role/listAll'
  return axios.get(url).then(res => res.data)
}

// 分页查询角色
export function roleListPage(params) {
  const url = '/role/listPage'
  return axios.post(url, params).then(res => res.data)
}

// 修改角色
export function roleUpdate(params) {
  const url = '/role/update'
  return axios.post(url, params).then(res => res.data)
}
