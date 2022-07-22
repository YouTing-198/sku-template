import request from '@/utils/request'
// 获取用户列表
export const userListAPI = (data) => {
  return request({
    url: `/user/${data}`,
    method: 'GET'
  })
}
