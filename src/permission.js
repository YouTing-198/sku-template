import router from '@/router'
import store from '@/store'

router.beforeEach(async (to, from, next) => {
  const token = store.getters.token
  if (token && to.path === '/login') {
    return next(from.path)
  }
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  if (to.path !== '/login') {
    const userInfo = store.getters.userInfo
    if (JSON.stringify(userInfo) === '{}') {
      await store.dispatch('user/getUserInfo')
    }
  }
  next()
})
