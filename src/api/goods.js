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
/**
 * 上架或下架
 */
export const changeStatusAPI = (data) => {
  return request({
    url: `goods/changestatus`,
    method: 'POST',
    data
  })
}
/**
 * 恢复商品
 */
export const goodsRestoreAPI = (data) => {
  return request({
    url: `goods/restore`,
    method: 'POST',
    data
  })
}
// 删除
export const goodsDeleteAPI = (data) => {
  return request({
    url: `goods/delete_all`,
    method: 'POST',
    data
  })
}
// 彻底删除
export const goodsDeleteDestroyAPI = (data) => {
  return request({
    url: `goods/destroy`,
    method: 'POST',
    data
  })
}
