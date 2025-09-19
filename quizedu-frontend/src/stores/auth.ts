import { defineStore } from "pinia";
import router from "@/router";
import api from "@/services/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    user: JSON.parse(localStorage.getItem("authUser") || "null") as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "ADMIN",
  },

  actions: {
    async login(credentials: { email: string; password: any }) {
      try {
        const response = await api.post("/auth/login", credentials);

        const { access_token, user } = response.data;

        if (!access_token || !user) {
          throw new Error(
            "Token ou dados do usuário não encontrados na resposta da API"
          );
        }

        this.token = access_token;
        this.user = user;

        localStorage.setItem("authToken", access_token);
        localStorage.setItem("authUser", JSON.stringify(user));

        router.push("/admin/dashboard");
      } catch (error) {
        console.error("Falha no login:", error);
        alert("Email ou senha inválidos!");
      }
    },

    logout() {
      this.token = null;
      this.user = null;

      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      router.push("/login");
    },
  },
});
