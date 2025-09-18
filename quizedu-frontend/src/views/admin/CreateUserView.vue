<script setup lang="ts">
import { ref } from "vue";
import api from "@/services/api";
import router from "@/router";

const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("STUDENT"); // Valor padrão

const handleCreateUser = async () => {
  try {
    // ATENÇÃO: Verifique se os nomes dos campos batem com o que seu backend espera
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    };

    await api.post("/users", newUser); // Assumindo que a rota de usuários está em /users

    alert("Usuário criado com sucesso!");
    router.push("/admin/dashboard"); // Volta para o dashboard
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    alert("Ocorreu um erro ao criar o usuário.");
  }
};
</script>

<template>
  <div class="create-user-container">
    <h1>Criar Novo Usuário</h1>
    <form @submit.prevent="handleCreateUser">
      <div class="form-group">
        <label for="name">Nome</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="role">Função</label>
        <select id="role" v-model="role">
          <option value="STUDENT">Aluno</option>
          <option value="TEACHER">Professor</option>
        </select>
      </div>
      <button type="submit">Criar Usuário</button>
    </form>
  </div>
</template>

<style scoped>
.create-user-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input,
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
