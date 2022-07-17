import { loginAPI, userInfoAPI, logoutAPI } from '@/api/user'
import { setItem, getItem } from '@/utils/storage'
import { TOKEN } from '@/utils/constants'
import router from '@/router'
import { Notification } from '@/utils/Notification'

export default {
  namespaced: true,
  state: () => ({
    token: getItem(TOKEN) || '',
    userInfo: {}
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      setItem(TOKEN, token)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    async login({ commit }, data) {
      try {
        const { token } = await loginAPI(data)
        commit('setToken', token)
        Notification('登录成功', '', 'success')
        router.push('/')
      } catch (e) {
        console.log(e, 'vuex/user')
      }
    },
    async getUserInfo({ commit }) {
      try {
        const { data } = await userInfoAPI()
        commit('setUserInfo', data)
      } catch (e) {
        console.log(e, 'vuex/user')
      }
    },
    async userLogout({ commit }) {
      try {
        await logoutAPI()
        commit('setToken', '')
        commit('setUserInfo', {})
        Notification('退出登录成功', '', 'success')
        router.push('/login')
      } catch (e) {
        console.log(e, 'vuex/user')
      }
    }
  }
}
