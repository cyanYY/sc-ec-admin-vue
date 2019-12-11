import axios from '@/utils/request'

// 分页查询运单列表
export function listPage(params) {
  const url = '/wayBill/listPage'
  return axios.post(url, params).then(res => res.data)
}

// 导入运单
export function uploadWaybill(params) {
  const url = '/wayBill/upload?fileName'
  return axios.post(url, params).then(res => res.data)
}

// 导入异常运单
export function uploadWaybillException(params) {
  const url = '/wayBillException/upload?fileName=' + params.fileName
  return axios.post(url, params).then(res => res.data)
}

// 处理异常运单
export function handle(params) {
  const url = '/wayBillException/handle'
  return axios.post(url, params).then(res => res.data)
}

// 运单审核
export function exportAudit(params) {
  const url = '/wayBillException/exportAudit?agentId=' + params.agentId
  axios.post(url, params, { responseType: 'blob' }).then(res => {
    const fileName = '运单审核.xlsx'
    const blob = new Blob([res.data], { type: 'application/x-xls' })
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName)
    } else {
      var link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
  })
}

// 挂起异常运单
export function hang(params) {
  const url = '/wayBillException/hang'
  return axios.post(url, params).then(res => res.data)
}

// 查询挂起原因列表
export function listHang(params) {
  const url = '/wayBillException/listHang?wayBillNo=' + params.wayBillNo
  return axios.get(url).then(res => res.data)
}

// 查询运单轨迹
export function trace(params) {
  const url = '/wayBillException/trace?wayBillNo=' + params.wayBillNo
  return axios.get(url).then(res => res.data)
}

// 查询运单轨迹
export function listReceivables(params) {
  const url = '/wayBillException/listReceivables'
  return axios.post(url, params).then(res => res.data)
}

// 异常运单认领
export function claim(params) {
  const url = '/wayBillException/claim?wayBillNo=' + params.wayBillNo
  return axios.get(url).then(res => res.data)
}

// 分页查询用户待处理运单列表
export function listUserTodo(params) {
  const url = '/wayBillException/listUserTodo'
  return axios.post(url, params).then(res => res.data)
}

// 分页查询用户已处理运单列表
export function listUserFinish(params) {
  const url = '/wayBillException/listUserFinish'
  return axios.post(url, params).then(res => res.data)
}

// 退回已签收
export function returnSigned(params) {
  const url = '/wayBillException/returnSigned?wayBillNo=' + params.wayBillNo
  return axios.get(url).then(res => res.data)
}
