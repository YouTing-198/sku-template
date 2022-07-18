import { createStore } from 'vuex'
import getters from './getters'
import user from './modules/user'
import menu from './modules/menu'
import tagsView from './modules/tagsView'

export default createStore({
  modules: {
    user,
    menu,
    tagsView
  },
  getters
})
