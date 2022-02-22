import { createRouter, createWebHistory } from 'vue-router';
import IndexView from '../views/IndexView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            component: IndexView,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/tricinium',
            name: 'tricinium_list',
            component: () => import('../views/TriciniumListView.vue'),
        },
        {
            path: '/tricinium/:id',
            name: 'tricinium',
            component: () => import('../views/TriciniumView.vue'),
        },
    ],
});

export default router;
