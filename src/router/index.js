import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginScreen.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeScreen.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileScreen.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/workout',
      name: 'workout',
      component: () => import('@/views/HomeScreen.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Do I really need this?
  while (!authStore.ready) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // If the route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
    return
  }

  // If user is authenticated and trying to access login page
  if (to.path === '/' && authStore.isAuthenticated) {
    next('/home')
    return
  }

  next()
})

export default router 