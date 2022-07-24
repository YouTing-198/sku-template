import request from '@/utils/request'
// 获取等级列表
export const getLevelListAPI = (current) => {
  return request({
    url: `user_level/${current}`,
    method: 'GET'
  })
}
// 修改状态
export const editStatusAPI = (id, status) => {
  return request({
    url: `user_level/${id}/update_status`,
    method: 'POST',
    data: status
  })
}
// 添加-修改接口
export const userLevelAPI = (data) => {
  const url = data.id ? `user_level/${data.id}` : 'user_level'
  return request({
    url,
    method: 'POST',
    data
  })
}
