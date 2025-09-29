import { defineStore } from "pinia";

import api from "@/services/api";

import type { Quiz } from "@/types/quiz";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    items: [] as Quiz[],
    loading: false as boolean,
    current: null as Quiz | null,
    error: null as string | null,
  }),

  getters: {
    published: (state) => state.items.filter((q) => q.published),
    byId: (state) => (id: number) => state.items.find((q) => q.id === id),
  },

  actions: {
    async fetchAll() {
      try {
        this.loading = true;
        this.error = null;
        const { data } = await api.get<Quiz[]>("/quizzes");
        this.items = data;
      } catch (err: any) {
        console.error(err);
        this.error = "Não foi possível carregar os quizzes.";
      } finally {
        this.loading = false;
      }
    },

    async fetchById(id: number) {
      try {
        this.loading = true;
        this.error = null;

        const cached = this.items.find((q) => q.id === id);
        if (cached) {
          this.current = cached;
          return cached;
        }

        const { data } = await api.get<Quiz>(`/quizzes/${id}`);
        this.current = data;

        const exists = this.items.find((q) => q.id === data.id);
        if (!exists) this.items.push(data);

        return data;
      } catch (err: any) {
        console.error(err);
        this.error = "Não foi possível carregar este quiz.";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearCurrent() {
      this.current = null;
      this.error = null;
    },
  },
});
