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
 * 添加 修改
 */
export const addSkusAPI = (data) => {
  const url = data.id ? `/skus/${data.id}` : '/skus'
  return request({
    url,
    method: 'POST',
    data
  })
}
/**
 * 删除规格
 */
export const deleteSkusAPI = (data) => {
  return request({
    url: 'skus/delete_all',
    method: 'POST',
    data
  })
}
