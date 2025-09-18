import { defineStore } from "pinia";
import router from "@/router"; // Importaremos o router para redirecionar
import api from "@/services/api";

// Tipagem para os dados do usuário
interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Tenta pegar os dados do localStorage ao iniciar
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
        const response = await api.post("/login", credentials);

        // ATENÇÃO: Ajuste aqui conforme a resposta REAL da sua API
        const { token, user } = response.data;

        if (!token || !user) {
          throw new Error(
            "Token ou dados do usuário não encontrados na resposta da API"
          );
        }

        // Salva no estado da store
        this.token = token;
        this.user = user;

        // Salva no localStorage para persistir o login
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));

        // Redireciona o usuário para o dashboard após o login
        router.push("/admin/dashboard");
      } catch (error) {
        console.error("Falha no login:", error);
        // Aqui você pode adicionar lógica para mostrar uma mensagem de erro na tela
        alert("Email ou senha inválidos!");
      }
    },

    logout() {
      // Limpa o estado
      this.token = null;
      this.user = null;

      // Limpa o localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      // Redireciona para a tela de login
      router.push("/login");
    },
  },
});
