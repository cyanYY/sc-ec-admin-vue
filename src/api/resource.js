import axios from '@/utils/request'

// 添加资源
export function resourceAdd(params) {
  const url = '/resource/add'
  return axios.post(url, params).then(res => res.data)
}

// 删除资源
export function resourceDelete(params) {
  const url = '/resource/delete?id=' + params.id
  return axios.get(url).then(res => res.data)
}

// 查询所有资源列表
export function resourceListAll() {
  const url = '/resource/listAll'
  return axios.get(url).then(res => res.data)
}

// 根据角色获取权限
export function resourceListByRoleId(param) {
  const url = '/resource/listByRoleId?roleId=' + param.roleId
  return axios.get(url).then(res => res.data)
}

// 查询所有菜单列表
export function resourceListMenus() {
  const url = '/resource/listMenus'
  return axios.get(url).then(res => res.data)
}

// 获取菜单树
export function resourceTreeAll() {
  const url = '/resource/treeAll'
  return axios.get(url).then(res => res.data)
}

// 修改资源
export function resourceUpdate(params) {
  const url = '/resource/update'
  return axios.post(url, params).then(res => res.data)
}
