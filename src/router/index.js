import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout'),
    children: [
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/404')
      }
    ]
  },
  {
    path: '/testIcon',
    name: 'testIcon',
    component: () => import('@/views/testIcon')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
