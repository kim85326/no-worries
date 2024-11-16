// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/restaurants',
      name: 'restaurants',
      component: () => import('../views/RestaurantsView.vue'),
    },
    {
      path: '/on-street-parking',
      name: 'onStreetParking',
      component: () => import('../views/OnStreetParkingView.vue'),
    },
  ],
})

export default router