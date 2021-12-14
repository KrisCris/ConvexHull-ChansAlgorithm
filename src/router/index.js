import { createRouter, createWebHistory } from 'vue-router'
import Test from '../views/Test.vue'
import ChansAlg from '../views/ChansAlg.vue'

const routes = [
  {
    path: '/Test',
    name: 'Test',
    component: Test
  },
  {
    path: '/ChansAlg',
    name: 'ChansAlg',
    component: ChansAlg
  },
  {
    path: '/',
    redirect: '/ChansAlg'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
