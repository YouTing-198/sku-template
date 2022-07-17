import { loginAPI } from '@/api/user'
import { setItem, getItem } from '@/utils/storage'
import { TOKEN } from '@/utils/constants'

export default {
  namespaced: true,
  state: () => ({
    token: getItem(TOKEN) || ''
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      setItem(TOKEN, token)
    }
  },
  actions: {
    async login({ commit }, data) {
      try {
        const { token } = await loginAPI(data)
        commit('setToken', token)
      } catch (e) {
        console.log(e, 'vuex/user')
      }
    }
  }
}
