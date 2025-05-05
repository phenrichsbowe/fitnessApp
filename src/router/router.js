import { createRouter, createWebHistory } from 'vue-router'

// Import your views/components
import LoginScreen from '@/views/LoginScreen.vue'
import HomeScreen from '@/views/HomeScreen.vue'
import SettingsScreen from '@/views/SettingsScreen.vue'
import ProfileScreen from '@/views/ProfileScreen.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginScreen },
  { path: '/home', name: 'Home', component: HomeScreen },
  { path: '/settings', name: 'Settings', component: SettingsScreen },
  { path: '/profile', name: 'Profile', component: ProfileScreen },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
