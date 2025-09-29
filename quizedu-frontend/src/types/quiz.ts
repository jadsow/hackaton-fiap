export type QuestionType = "MULTIPLE_CHOICE" | "OPEN";

export interface QuizOption {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  text: string;
  type: QuestionType;
  options: QuizOption[];
}

export interface QuizAuthor {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  createdAt: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  published: boolean;
  authorId: number;
  createdAt: string;
  questions: QuizQuestion[];
  author: QuizAuthor;
}
