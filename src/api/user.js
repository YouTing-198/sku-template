import request from '@/utils/request'
/**
 * 登录
 */
export const getLogin = (data) => {
  return request({
    url: `/login?username=${data.username}&password=${data.password}&code=${data.code}&token=${data.token}`,
    method: 'POST'
  })
}
