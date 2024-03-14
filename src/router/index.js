import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import UserModule from '@/views/UserModule.vue'
import LoginPage from '@/views/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
      children: [
        {
          path: '/users',
          name: 'UserModule',
          component: UserModule
        }
      ]
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    }
  ]
})

export default router
