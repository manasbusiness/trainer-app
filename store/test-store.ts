import { create } from 'zustand';

interface Question {
    id: string;
    question: string;
    type: "MCQ" | "TRUE_FALSE" | "FIB" | "MATCHING";
    marks: number;
    options: {
        id: string;
        text: string;
        matchText?: string | null;
        isCorrect: boolean;
    }[];
}

interface TestState {
    questions: Question[];
    answers: Record<string, string>;
    currentQuestionIndex: number;
    timeLeft: number; // in seconds
    isSubmitting: boolean;

    initialize: (questions: Question[], durationMinutes: number) => void;
    setAnswer: (questionId: string, option: string) => void;
    setCurrentQuestion: (index: number) => void;
    tick: () => void;
    setSubmitting: (val: boolean) => void;
}

export const useTestStore = create<TestState>((set) => ({
    questions: [],
    answers: {},
    currentQuestionIndex: 0,
    timeLeft: 0,
    isSubmitting: false,

    initialize: (questions, durationMinutes) => set({
        questions,
        timeLeft: durationMinutes * 60,
        answers: {},
        currentQuestionIndex: 0,
        isSubmitting: false
    }),

    setAnswer: (questionId, option) => set((state) => ({
        answers: { ...state.answers, [questionId]: option }
    })),

    setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

    tick: () => set((state) => ({
        timeLeft: Math.max(0, state.timeLeft - 1)
    })),

    setSubmitting: (val) => set({ isSubmitting: val })
}));
