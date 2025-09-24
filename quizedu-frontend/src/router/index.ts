import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import AdminDashboardView from "../views/admin/AdminDashboardView.vue";
import CreateUserView from "../views/admin/CreateUserView.vue";
import QuizzesList from "@/views/quiz/QuizzesList.vue";
import QuizPlay from "@/views/quiz/QuizPlay.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: AdminDashboardView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/users/create",
      name: "create-user",
      component: CreateUserView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/quizzes",
      name: "quizzes",
      component: QuizzesList,
      meta: { requiresAuth: true },
    },
    {
      path: "/quizzes/:id",
      name: "quiz-play",
      component: QuizPlay,
      meta: { requiresAuth: true },
      props: true,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "login" });
  }

  if (requiresAdmin && !authStore.isAdmin) {
    alert("Acesso negado. Você precisa ser um administrador.");
    return next({ name: "login" });
  }

  next();
});

export default router;
