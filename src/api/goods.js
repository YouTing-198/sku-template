/**
 * 商品模块
 */
import request from '@/utils/request'

/**
 * 获取商品列表
 */
export const goodsListAPI = (current, data) => {
  const query = {}
  // 容错处理 没有传值不传
  for (const key in data) {
    if (data[key]) {
      query[key] = data[key]
    }
  }
  return request({
    url: `/goods/${current}`,
    method: 'GET',
    data: query
  })
}
/**
 * 添加商品
 */
export const addGoodsAPI = (data) => {
  const url = data.id ? `/goods/${data.id}` : '/goods'
  return request({
    url,
    method: 'POST',
    data
  })
}
