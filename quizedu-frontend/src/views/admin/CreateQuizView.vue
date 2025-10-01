<script setup lang="ts">
import router from "@/router";
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import type { QuestionType } from "@/types/quiz";
import { reactive, ref } from "vue";

type NewOption = { uid: string; text: string; isCorrect?: boolean };

type NewQuestion = {
  uid: string;
  text: string;
  type: QuestionType;
  options: NewOption[];
};

const auth = useAuthStore();

const title = ref("");
const description = ref("");

const questions = reactive<NewQuestion[]>([]);

const uid = () => Math.random().toString(36).slice(2, 9);

addQuestion();

function addQuestion() {
  questions.push({
    uid: uid(),
    text: "",
    type: "MULTIPLE_CHOICE",
    options: [
      { uid: uid(), text: "" },
      { uid: uid(), text: "" },
    ],
  });
}

function removeQuestion(index: number) {
  questions.splice(index, 1);
}

function changeType(q: NewQuestion) {
  if (q.type === "OPEN") {
    q.options = [];
  } else if (q.type === "MULTIPLE_CHOICE" && q.options.length < 2) {
    q.options = [
      { uid: uid(), text: "" },
      { uid: uid(), text: "" },
    ];
  }
}

function addOption(q: NewQuestion) {
  q.options.push({ uid: uid(), text: "" });
}

function removeOption(q: NewQuestion, i: number) {
  q.options.splice(i, 1);
}

function markCorrect(q: NewQuestion, idx: number) {
  q.options.forEach((o, i) => (o.isCorrect = i === idx));
}

function validate(): string | null {
  if (!title.value.trim()) return "Informe o título do quiz.";
  if (questions.length === 0) return "Adicione pelo menos uma pergunta.";

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.text.trim()) return `A pergunta #${i + 1} precisa de um enunciado.`;

    if (q.type === "MULTIPLE_CHOICE") {
      if (q.options.length < 2)
        return `A pergunta #${i + 1} precisa de pelo menos 2 opções.`;
      if (q.options.some((o) => !o.text.trim())) {
        return `Todas as opções da pergunta #${i + 1} devem ter texto.`;
      }
      if (!q.options.some((o) => o.isCorrect)) {
        return `Marque a opção correta da pergunta #${i + 1}.`;
      }
    }
  }
  return null;
}

async function handleCreateQuiz() {
  try {
    const err = validate();
    if (err) return alert(err);

    if (!auth.user?.id) {
      alert("Você precisa estar autenticado para criar um quiz.");
      return;
    }

    const payload = {
      authorId: auth.user.id,
      title: title.value.trim(),
      description: description.value.trim() || undefined,
      questions: questions.map((q) => ({
        text: q.text.trim(),
        type: q.type,
        ...(q.type === "MULTIPLE_CHOICE"
          ? {
              options: q.options.map((o) => ({
                text: o.text.trim(),
                isCorrect: o.isCorrect ? true : undefined,
              })),
            }
          : {}),
      })),
    };

    console.log("Payload to send:", payload);

    await api.post("/quizzes", payload);

    alert("Quiz criado com sucesso!");
    router.push("/quizzes");
  } catch (error) {
    console.error("Erro ao criar quiz:", error);
    alert("Ocorreu um erro ao criar o quiz.");
  }
}
</script>

<template>
  <div class="create-quiz-container">
    <h1>Criar Novo Quiz</h1>

    <form @submit.prevent="handleCreateQuiz">
      <div class="form-group">
        <label for="title">Título</label>
        <input id="title" type="text" v-model="title" required />
      </div>

      <div class="form-group">
        <label for="description">Descrição (opcional)</label>
        <input id="description" type="text" v-model="description" />
      </div>

      <div class="questions-header">
        <h2>Perguntas</h2>
        <button type="button" class="secondary" @click="addQuestion">
          + Adicionar pergunta
        </button>
      </div>

      <div v-if="questions.length === 0" class="info">
        Nenhuma pergunta adicionada ainda.
      </div>

      <div class="question-card" v-for="(q, qi) in questions" :key="q.uid">
        <div class="question-row">
          <div class="form-group flex-1">
            <label :for="`q-text-${qi}`">Enunciado</label>
            <input
              :id="`q-text-${qi}`"
              type="text"
              v-model="q.text"
              required
              placeholder="Digite o enunciado"
            />
          </div>

          <div class="form-group type-field">
            <label :for="`q-type-${qi}`">Tipo</label>
            <select
              :id="`q-type-${qi}`"
              v-model="q.type"
              @change="changeType(q)"
            >
              <option value="MULTIPLE_CHOICE">Múltipla escolha</option>
              <option value="OPEN">Aberta</option>
            </select>
          </div>
        </div>

        <div v-if="q.type === 'MULTIPLE_CHOICE'" class="options-block">
          <div class="options-header">
            <h3>Opções</h3>
            <button type="button" class="secondary" @click="addOption(q)">
              + Adicionar opção
            </button>
          </div>

          <div class="option-row" v-for="(opt, oi) in q.options" :key="opt.uid">
            <label class="is-correct">
              <input
                type="radio"
                :name="`correct-${q.uid}`"
                :checked="!!opt.isCorrect"
                @change="markCorrect(q, oi)"
              />
              Correta
            </label>

            <input
              class="option-input"
              type="text"
              v-model="opt.text"
              placeholder="Texto da opção"
              required
            />

            <button type="button" class="danger" @click="removeOption(q, oi)">
              Remover
            </button>
          </div>

          <p class="hint">
            Dica: Múltipla escolha exige 2+ opções e pelo menos 1 correta.
          </p>
        </div>

        <div class="question-actions">
          <button type="button" class="danger" @click="removeQuestion(qi)">
            Remover pergunta
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit">Criar Quiz</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-quiz-container {
  max-width: 900px;
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

.questions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 8px;
}
.info {
  margin: 8px 0 16px;
  color: #555;
}

.question-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
  background: #11182708;
}
.question-row {
  display: flex;
  gap: 12px;
}
.flex-1 {
  flex: 1;
}
.type-field {
  width: 220px;
}

.options-block {
  margin-top: 10px;
}
.options-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.option-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.is-correct {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}
.option-input {
  width: 100%;
  padding: 8px;
}

.question-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.secondary {
  padding: 8px 12px;
  background: #e5e7eb;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.danger {
  padding: 8px 12px;
  background: #ef4444;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions {
  margin-top: 20px;
}
button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
