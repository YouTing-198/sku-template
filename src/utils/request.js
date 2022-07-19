import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 创建axios实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    NProgress.start()
    store.dispatch('loading/openLoading')
    const token = store.getters.token
    if (token) {
      config.headers.token = token
    }
    // 在发送请求之前做些什么
    return config
  },
  (error) => {
    NProgress.done()
    store.dispatch('loading/endLoading')
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    NProgress.done()
    store.dispatch('loading/endLoading')
    // 对响应数据做点什么
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
    NProgress.done()
    store.dispatch('loading/endLoading')
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
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

const _showError = (msg) => {
  ElMessage.error(msg)
}

// 统一传参
const request = (data) => {
  data.params =
    data.method.toLowerCase() === 'get' ? (data.params = data.data) : {}
  return instance(data)
}

export default request
