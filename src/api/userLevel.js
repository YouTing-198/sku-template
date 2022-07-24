import request from '@/utils/request'
// 获取等级列表
export const getLevelListAPI = (current) => {
  return request({
    url: `user_level/${current}`,
    method: 'GET'
  })
}
