import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About.vue'
import ChansAlg from '../views/ChansAlg.vue'

const routes = [
  {
    path: '/About',
    name: 'About',
    component: About
  },
  {
    path: '/',
    name: 'ChansAlg',
    component: ChansAlg
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
