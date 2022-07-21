// 判断优惠券状态
import { time } from '@/utils/filterTime'

export const couponStatus = (startTime, endTime) => {
  // 开始时间
  const start = startTime + ''
  // 结束时间
  const end = endTime + ''
  const data = new Date()
  // 获取当前时间
  const nowTime = time(data) + ''
  // 如果当前时间小于优惠券开始时间 return 0 未开始
  if (nowTime < start) {
    return '0'
  }
  // 如果当前时间大于优惠券开始时间 && 小于结束时间 return 1 已开始
  if (nowTime > start && nowTime < end) {
    return '1'
  }
  // 否则 return 2
  return '2'
}
