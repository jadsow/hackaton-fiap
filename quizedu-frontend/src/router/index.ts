import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import AdminDashboardView from "../views/admin/AdminDashboardView.vue";
import CreateUserView from "../views/admin/CreateUserView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login", // Redireciona a raiz para o login
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
      meta: { requiresAuth: true, requiresAdmin: true }, // Metadados de proteção
    },
    {
      path: "/admin/users/create",
      name: "create-user",
      component: CreateUserView,
      meta: { requiresAuth: true, requiresAdmin: true }, // Metadados de proteção
    },
  ],
});

// O Guarda de Navegação Global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;

  // Se a rota precisa de autenticação e o usuário não está logado...
  if (requiresAuth && !authStore.isAuthenticated) {
    // ...redireciona para o login.
    return next({ name: "login" });
  }

  // Se a rota precisa de permissão de admin e o usuário não é admin...
  if (requiresAdmin && !authStore.isAdmin) {
    // ...redireciona para um lugar seguro (ou mostra um erro).
    // Por enquanto, vamos redirecionar para o login também.
    alert("Acesso negado. Você precisa ser um administrador.");
    return next({ name: "login" });
  }

  // Se tudo estiver ok, permite a navegação.
  next();
});

export default router;
