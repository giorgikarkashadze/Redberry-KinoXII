import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/',                name: 'home',         component: () => import('@/pages/HomePage.vue'      )},
    { path: '/sessions',        name: 'sessions',     component: () => import('@/pages/SessionsPage.vue'  )},
    { path: '/movies/:movie',   name: 'movie',        component: () => import('@/pages/MoviePage.vue'     )},
    { path: '/profile',         name: 'profile',      component: () => import('@/pages/ProfilePage.vue'   )},
    { path: '/:pathMatch(.*)*', name: 'not-found',    component: () => import('@/pages/NotFoundPage.vue'  )},
  ],
})

export default router