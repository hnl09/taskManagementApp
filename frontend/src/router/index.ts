import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import ForgetPassword from '../components/ForgetPassword.vue';
import Tasks from '../components/Tasks.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forget-password', component: ForgetPassword },
  { path: '/tasks', component: Tasks}

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;