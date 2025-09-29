import { lsGet, lsRemove, lsSet } from "@/utils/storage";
import { ref, watch, type Ref } from "vue";

export type AnswerValue = number | string | null;

export interface PersistedQuizState<T extends AnswerValue = AnswerValue> {
  answers: Record<number, T>;
  step: number;
  showResult: boolean;
  score: number;
  updatedAt: string;
}

const KEY = (quizId: number) => `quiz:${quizId}:state`;

export function useQuizPersistence<T extends AnswerValue = AnswerValue>(
  quizId: number,
  stateRefs: {
    answers: Ref<Record<number, T>>;
    step: Ref<number>;
    showResult: Ref<boolean>;
    score: Ref<number>;
  }
) {
  const hasLoaded = ref(false);

  function load() {
    const saved = lsGet<PersistedQuizState<T> | null>(KEY(quizId), null);
    if (saved) {
      const target = stateRefs.answers.value;

      for (const k of Object.keys(target)) delete (target as any)[k];

      if (saved.answers) {
        for (const [k, v] of Object.entries(saved.answers)) {
          let value: AnswerValue = v as AnswerValue;
          if (typeof value === "string" && /^\d+$/.test(value)) {
            value = Number(value);
          }
          (target as any)[Number(k)] = value as T;
        }
      }

      stateRefs.step.value = saved.step ?? 0;
      stateRefs.showResult.value = !!saved.showResult;
      stateRefs.score.value = saved.score ?? 0;
    }
    hasLoaded.value = true;
  }

  function save() {
    const payload: PersistedQuizState<T> = {
      answers: stateRefs.answers.value,
      step: stateRefs.step.value,
      showResult: stateRefs.showResult.value,
      score: stateRefs.score.value,
      updatedAt: new Date().toISOString(),
    };
    lsSet(KEY(quizId), payload);
  }

  function clear() {
    lsRemove(KEY(quizId));
  }

  watch(
    [stateRefs.answers, stateRefs.step, stateRefs.showResult, stateRefs.score],
    () => {
      if (hasLoaded.value) save();
    },
    { deep: true }
  );

  return { load, save, clear, hasLoaded };
}
