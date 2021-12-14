import { createRouter, createWebHistory } from 'vue-router'
import Test from '../views/Test.vue'
import ChanAlg from '../views/ChanAlg.vue'

const routes = [
  {
    path: '/Test',
    name: 'Test',
    component: Test
  },
  {
    path: '/ChanAlg',
    name: 'ChanAlg',
    component: ChanAlg
  },
  {
    path: '/',
    redirect: '/ChanAlg'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
