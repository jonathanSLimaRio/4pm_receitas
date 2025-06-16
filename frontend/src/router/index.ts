import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import CategoryView from "@/views/CategoryView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/dashboard", component: DashboardView },
  { path: "/categories", component: CategoryView },
  { path: "/", redirect: "/login" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path === '/dashboard' && !token) {
    next('/login');
  } else {
    next();
  }
});
