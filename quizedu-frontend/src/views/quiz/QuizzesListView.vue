<template>
  <div class="list-container">
    <h1>Quizzes</h1>

    <div class="toolbar">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por título…"
        aria-label="Buscar por título"
      />
      <label class="checkbox">
        <input type="checkbox" v-model="onlyPublished" />
        Mostrar apenas publicados
      </label>
    </div>

    <div v-if="quizStore.loading" class="info">Carregando…</div>
    <div v-else-if="quizStore.error" class="error">{{ quizStore.error }}</div>
    <div v-else-if="filtered.length === 0" class="info">
      Nenhum quiz encontrado.
    </div>

    <div class="grid">
      <div
        v-for="quiz in filtered"
        :key="quiz.id"
        class="card"
        role="button"
        tabindex="0"
        @click="goToQuiz(quiz.id)"
        @keydown.enter="goToQuiz(quiz.id)"
      >
        <div class="card-header">
          <h2>{{ quiz.title }}</h2>
          <span class="badge" :class="quiz.published ? 'ok' : 'warn'">
            {{ quiz.published ? "Publicado" : "Rascunho" }}
          </span>
        </div>
        <p class="desc">{{ quiz.description || "—" }}</p>
        <div class="meta">
          <span>Perguntas: {{ quiz.questions?.length ?? 0 }}</span>
          <span>Autor: {{ quiz.author?.name ?? "—" }}</span>
        </div>
        <button class="primary">Começar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "@/stores/quiz";

const quizStore = useQuizStore();
const router = useRouter();

const search = ref("");
const onlyPublished = ref(false);

const filtered = computed(() => {
  const base = onlyPublished.value ? quizStore.published : quizStore.items;
  const s = search.value.trim().toLowerCase();
  if (!s) return base;
  return base.filter((q) => q.title.toLowerCase().includes(s));
});

function goToQuiz(id: number) {
  router.push({ name: "quiz-play", params: { id } });
}

onMounted(() => {
  if (!quizStore.items.length) quizStore.fetchAll();
});
</script>

<style scoped>
.list-container {
  max-width: 960px;
  margin: 40px auto;
  padding: 20px;
}
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.toolbar input[type="text"] {
  flex: 1;
  padding: 8px;
  box-sizing: border-box;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}
.info {
  margin: 16px 0;
}
.error {
  margin: 16px 0;
  color: #b00020;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 14px;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.05s ease;
  background: #11182711;
}
.card:focus,
.card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.badge.ok {
  background: #e6f7f0;
  color: #0f9155;
}
.badge.warn {
  background: #fff3cd;
  color: #a07900;
}
.desc {
  margin: 8px 0 12px;
  min-height: 40px;
}
.meta {
  font-size: 12px;
  color: #555;
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.primary {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
