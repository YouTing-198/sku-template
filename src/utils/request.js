import axios from 'axios'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Notification } from '@/utils/Notification'
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
    Notification(msg)
    return Promise.reject(msg)
  },
  (error) => {
    NProgress.done()
    store.dispatch('loading/endLoading')
    const { message } = error
    if (message.includes('Network Error')) {
      Notification('网络错误', '', 'error')
      return Promise.reject(message)
    }
    if (message.includes('timeout')) {
      Notification('请求超时', '', 'error')
      return Promise.reject(message)
    }
    const {
      status,
      data: { msg }
    } = error.response
    switch (status) {
      case 401:
        Notification('登录已过期，请重新登录', '', 'error')
        break
      case 403:
        Notification('没有权限', '', 'error')
        break
      case 404:
        Notification('请求资源不存在', '', 'error')
        break
      case 500:
        Notification('服务器错误', '', 'error')
        break
      default:
        Notification('', msg, 'error')
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 统一传参
const request = (data) => {
  data.params =
    data.method.toLowerCase() === 'get' ? (data.params = data.data) : {}
  return instance(data)
}

export default request
