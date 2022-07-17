import router from '@/router'
import store from '@/store'

router.beforeEach((to, from, next) => {
  const token = store.getters.token
  if (token && to.path === '/login') {
    return next(from.path)
  }
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  next()
})
