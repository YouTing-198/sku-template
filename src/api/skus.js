// 规格
import request from '@/utils/request'

/**
 * 获取规格列表
 */
export const getSkuListAPI = (current) => {
  return request({
    url: `/skus/${current}`,
    method: 'GET'
  })
}
/**
 * 状态切换
 */
export const updateSkuStatusAPI = (id, data) => {
  return request({
    url: `skus/${id}/update_status`,
    method: 'POST',
    data
  })
}
/**
 * 新增规格
 */
export const addSkusAPI = (data) => {
  return request({
    url: '/skus',
    method: 'POST',
    data
  })
}
