import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About.vue'
import Chans from '../views/Chans.vue'

const routes = [
  {
    path: '/About',
    name: 'About',
    component: About
  },
  {
    path: '/',
    name: 'Chans',
    component: Chans
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
