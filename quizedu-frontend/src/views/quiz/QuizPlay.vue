<template>
  <div class="quiz-container" v-if="!quizStore.loading && quiz">
    <header class="header">
      <div>
        <h1>{{ quiz.title }}</h1>
        <p class="subtitle">{{ quiz.description || "—" }}</p>
      </div>
      <button class="ghost" @click="goBack">← Voltar</button>
    </header>

    <div v-if="quiz.questions?.length">
      <div class="progress">Questão {{ step + 1 }} de {{ total }}</div>

      <div class="question-card">
        <h2 class="question">{{ current.text }}</h2>
        <div class="options">
          <label v-for="opt in current.options" :key="opt.id" class="option">
            <input
              type="radio"
              name="answer"
              :value="opt.id"
              v-model="answers[current.id]"
            />
            <span>{{ opt.text }}</span>
          </label>
        </div>

        <div class="actions">
          <button @click="prev" :disabled="step === 0">Anterior</button>
          <button v-if="!isLast" class="primary" @click="next">Próxima</button>
          <button v-else class="primary" @click="finish">Finalizar</button>
        </div>
      </div>
    </div>

    <div v-else class="info">Este quiz não possui perguntas.</div>

    <div v-if="showResult" class="result">
      <h2>Resultado</h2>
      <p>
        Você acertou <strong>{{ score }}</strong> de <strong>{{ total }}</strong
        >.
      </p>
      <button class="ghost" @click="restart">Refazer</button>
    </div>
  </div>

  <div v-else-if="quizStore.loading" class="quiz-container info">
    Carregando…
  </div>
  <div v-else class="quiz-container error">
    {{ quizStore.error || "Quiz não encontrado." }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuizStore } from "@/stores/quiz";
import type { QuizQuestion } from "@/types/quiz";

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const id = Number(route.params.id);
const step = ref(0);
const answers = reactive<Record<number, number | null>>({});
const showResult = ref(false);
const score = ref(0);

const quiz = computed(() => quizStore.current ?? quizStore.byId(id));
const questions = computed<QuizQuestion[]>(() => quiz.value?.questions ?? []);
const total = computed(() => questions.value.length);
const current = computed<QuizQuestion>(() => questions.value[step.value]);

const isLast = computed(() => step.value === total.value - 1);

function goBack() {
  router.push({ name: "quizzes" });
}

function next() {
  if (step.value < total.value - 1) step.value++;
}
function prev() {
  if (step.value > 0) step.value--;
}

function finish() {
  let s = 0;
  for (const q of questions.value) {
    const selectedOptId = answers[q.id];
    const opt = q.options.find((o) => o.id === selectedOptId);
    if (opt?.isCorrect) s++;
  }
  score.value = s;
  showResult.value = true;
}

function restart() {
  step.value = 0;
  showResult.value = false;
  score.value = 0;
  for (const q of questions.value) answers[q.id] = null;
}

onMounted(async () => {
  try {
    await quizStore.fetchById(id);
  } finally {
    for (const q of questions.value) {
      if (!(q.id in answers)) answers[q.id] = null;
    }
  }
});

watch(questions, (qs) => {
  for (const q of qs) if (!(q.id in answers)) answers[q.id] = null;
});
</script>

<style scoped>
.quiz-container {
  max-width: 760px;
  margin: 40px auto;
  padding: 20px;
}
.header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}
.subtitle {
  color: #666;
  margin-top: 4px;
}
.ghost {
  padding: 10px 14px;
  border: 1px solid #ccc;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
}
.info {
  margin: 16px 0;
}
.error {
  margin: 16px 0;
  color: #b00020;
}

.progress {
  margin: 16px 0;
  color: #444;
}
.question-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 14px;
}
.question {
  margin-bottom: 12px;
}
.options {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}
.option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
button {
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  background: #e5e7eb;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.primary {
  background-color: #42b983;
  color: white;
}
.result {
  margin-top: 20px;
  border-top: 1px dashed #ddd;
  padding-top: 16px;
}
</style>
