import request from '@/utils/request'
/**
 * 登录
 */
export const loginAPI = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
