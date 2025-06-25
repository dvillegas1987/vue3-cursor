import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import ProductoDetalle from '../components/ProductoDetalle.vue'
import Login from '../components/Login.vue'
import { requireAuth, requireGuest } from '../guards/auth'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: requireAuth
  },
  {
    path: '/producto/:id',
    name: 'ProductoDetalle',
    component: ProductoDetalle,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: requireGuest
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 