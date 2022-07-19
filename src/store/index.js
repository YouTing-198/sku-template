import { createStore } from 'vuex'
import getters from './getters'
import user from './modules/user'
import menu from './modules/menu'
import tagsView from './modules/tagsView'
import loading from './modules/loading'

export default createStore({
  modules: {
    user,
    menu,
    tagsView,
    loading
  },
  getters
})
