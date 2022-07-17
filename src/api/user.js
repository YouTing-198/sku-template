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
/**
 * 用户信息
 */
export const userInfoAPI = () => {
  return request({
    url: '/getinfo',
    method: 'POST'
  })
}
/**
 * 退出登录
 */
export const logoutAPI = () => {
  return request({
    url: '/logout',
    method: 'POST'
  })
}
