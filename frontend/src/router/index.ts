import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import ForgetPassword from '../components/ForgetPassword.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forget-password', component: ForgetPassword },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;