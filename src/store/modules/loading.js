export default {
  namespaced: true,
  state: () => ({
    loading: false
  }),
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    openLoading({ commit }) {
      commit('setLoading', true)
    },
    endLoading({ commit }) {
      commit('setLoading', false)
    }
  }
}
