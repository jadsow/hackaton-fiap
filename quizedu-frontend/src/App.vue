<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <main>
    <!-- O Vue Router vai renderizar a página correta aqui -->
    <RouterView />
  </main>
</template>

<style scoped>
main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
