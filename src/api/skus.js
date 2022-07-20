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
