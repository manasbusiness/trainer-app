"use server";

import { db } from "@/lib/db";
import { QuestionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTest(data: {
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
}) {
    const test = await db.test.create({
        data,
    });

    revalidatePath("/admin/tests");
    return test;
}

export async function addQuestion(testId: string, data: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
    marks: number;
}) {
    const { question, optionA, optionB, optionC, optionD, correctOption, marks } = data;

    await db.$transaction(async (tx) => {
        const createdQuestion = await tx.question.create({
            data: {
                testId,
                question,
                marks,
                type: QuestionType.MCQ,
                correctAnswer: correctOption // Storing the letter for reference, though Option.isCorrect is better
            }
        });

        const options = [
            { text: optionA, isCorrect: correctOption === "A" },
            { text: optionB, isCorrect: correctOption === "B" },
            { text: optionC, isCorrect: correctOption === "C" },
            { text: optionD, isCorrect: correctOption === "D" },
        ];

        await tx.option.createMany({
            data: options.map(opt => ({
                questionId: createdQuestion.id,
                text: opt.text,
                isCorrect: opt.isCorrect
            }))
        });
    });

    revalidatePath(`/admin/tests/${testId}/questions`);
}

export async function updateQuestion(questionId: string, testId: string, data: {
    question: string;
    marks: number;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
}) {
    const { question, marks, optionA, optionB, optionC, optionD, correctOption } = data;

    await db.$transaction(async (tx) => {
        // Update Question
        await tx.question.update({
            where: { id: questionId },
            data: {
                question,
                marks,
                correctAnswer: correctOption
            }
        });

        // Delete existing options and recreate (simplest approach to ensure order/updates)
        // Or update if IDs were passed, but we're keeping it simple for now.
        await tx.option.deleteMany({
            where: { questionId }
        });

        const options = [
            { text: optionA, isCorrect: correctOption === "A" },
            { text: optionB, isCorrect: correctOption === "B" },
            { text: optionC, isCorrect: correctOption === "C" },
            { text: optionD, isCorrect: correctOption === "D" },
        ];

        await tx.option.createMany({
            data: options.map(opt => ({
                questionId,
                text: opt.text,
                isCorrect: opt.isCorrect
            }))
        });
    });

    revalidatePath(`/admin/tests/${testId}/questions`);
}

export async function deleteQuestion(questionId: string, testId: string) {
    await db.question.delete({ where: { id: questionId } });
    revalidatePath(`/admin/tests/${testId}/questions`);
}
