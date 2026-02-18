"use server";

import { db } from "@/lib/db";
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
    await db.question.create({
        data: {
            testId,
            ...data
        }
    });

    revalidatePath(`/admin/tests/${testId}/questions`);
}

export async function deleteQuestion(questionId: string, testId: string) {
    await db.question.delete({ where: { id: questionId } });
    revalidatePath(`/admin/tests/${testId}/questions`);
}
