import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/negocio', // Redirige a la página de Negocio por defecto
  },
  {
    path: '/negocio',
    component: () => import('../views/NegocioPage.vue'),
  },
  {
    path: '/tecnico',
    component: () => import('../views/TecnicoPage.vue'),
  },
  {
    path: '/kpis',
    component: () => import('../views/KpiPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;