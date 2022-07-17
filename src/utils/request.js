import axios from 'axios'
import { ElMessage } from 'element-plus'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    _showError('请求超时')
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const {
      status,
      data: { msg, data }
    } = response
    if (status === 200) {
      return data
    }
    _showError(msg)
    return Promise.reject(msg)
  },
  (error) => {
    const { message } = error
    if (message.includes('Network Error')) {
      _showError('网络错误')
      return Promise.reject(message)
    }
    if (message.includes('timeout')) {
      _showError('请求超时')
      return Promise.reject(message)
    }
    const {
      status,
      data: { msg }
    } = error.response
    switch (status) {
      case 401:
        _showError('登录已过期，请重新登录')
        break
      case 403:
        _showError('没有权限')
        break
      case 404:
        _showError('请求资源不存在')
        break
      case 500:
        _showError('服务器错误')
        break
      default:
        _showError(msg)
    }
    return Promise.reject(error)
  }
)
// 响应提示信息
const _showError = (message) => {
  const info = message || '发生未知错误'
  ElMessage.error(info)
}
// 统一了传参处理
const request = (options) => {
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data || {}
  }
  return service(options)
}
// 导出axios实例对象
export default request
