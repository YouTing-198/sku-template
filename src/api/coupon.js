import request from '@/utils/request'
/**
 *  获取优惠券列表
 */
export const getCouponAPI = (current) => {
  return request({
    url: `/coupon/${current}`,
    method: 'GET'
  })
}
