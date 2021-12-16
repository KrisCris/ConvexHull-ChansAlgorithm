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
