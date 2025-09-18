<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
</script>

<template>
  <div class="dashboard">
    <h1>Bem-vindo, {{ authStore.user?.name }}!</h1>
    <p>Este é o seu painel de Administrador.</p>
    <nav>
      <RouterLink to="/admin/users/create">Criar Novo Usuário</RouterLink>
    </nav>
    <button @click="authStore.logout()">Sair</button>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}
nav {
  margin: 20px 0;
}
button {
  padding: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
