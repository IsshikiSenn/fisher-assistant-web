import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import UserModule from '@/views/UserModule.vue'
import LoginPage from '@/views/LoginPage.vue'
import WelcomModule from '@/views/WelcomModule.vue'
import ArticleModule from '@/views/ArticleModule.vue'
import CategoryModule from '@/views/CategoryModule.vue'
import GoodsModule from '@/views/GoodsModule.vue'
import OrderModule from '@/views/OrderModule.vue'
import OrgModule from '@/views/OrgModule.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
      children: [
        {
          path: '/',
          component: WelcomModule
        },
        {
          path: '/users',
          component: UserModule
        },
        {
          path: '/articles',
          component: ArticleModule
        },
        {
          path: '/categorys',
          component: CategoryModule
        },
        {
          path: '/goods',
          component: GoodsModule
        },
        {
          path: '/orders',
          component: OrderModule
        },
        {
          path: '/orgs',
          component: OrgModule
        },
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
