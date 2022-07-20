import request from '@/utils/request'

/**
 * 获取分类列表
 */
export const getCategoryListAPI = (data) => {
  return request({
    url: '/category',
    method: 'GET',
    data
  })
}

/**
 * 推荐商品
 */
export const appCategortItemAPI = (data) => {
  return request({
    url: '/app_category_item/list',
    method: 'GET',
    data
  })
}
