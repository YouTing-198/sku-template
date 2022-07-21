// 优惠券模块

import request from '@/utils/request'

/**
 * 优惠券列表
 */
export const couponListAPI = (current) => {
  return request({
    url: `/coupon/${current}`,
    method: 'GET'
  })
}
/**
 * 添加--修改优惠券
 */
export const couponAPI = (data) => {
  const url = data.id ? `/coupon/${data.id}` : '/coupon'
  return request({
    url,
    method: 'POST',
    data
  })
}
/**
 * 删除优惠券
 */
export const deleteCouponAPI = (id) => {
  return request({
    url: `/coupon/${id}/delete`,
    method: 'POST'
  })
}
/**
 * 失效优惠券
 */
export const failureCouponAPI = (id, data) => {
  return request({
    url: `/coupon/${id}/update_status`,
    method: 'POST',
    data
  })
}
