"use server";

import { db } from "@/lib/db";
import { verifyRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitTestAttempt(testId: string, answers: Record<string, string>) {
    const cookieStore = await cookies();
    const token = cookieStore.get("refresh_token")?.value;
    if (!token) throw new Error("Unauthorized");

    let userId = "";
    try {
        const payload = await verifyRefreshToken(token);
        if (payload && typeof payload.userId === 'string') userId = payload.userId;
    } catch (e) { throw new Error("Unauthorized"); }

    if (!userId) throw new Error("Unauthorized");

    // 1. Fetch test and questions to calculate score
    const test = await db.test.findUnique({
        where: { id: testId },
        include: { questions: { include: { options: true } } }
    });

    if (!test) throw new Error("Test not found");

    let score = 0;
    let correctCount = 0;
    const totalQuestions = test.questions.length;
    const answerRecords = [];

    // 2. Calculate score
    for (const q of test.questions) {
        const selected = answers[q.id];
        let isCorrect = false;

        if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
            const selectedOption = q.options.find(o => o.id === selected);
            isCorrect = selectedOption ? selectedOption.isCorrect : false;
        } else if (q.type === "FIB") {
            isCorrect = selected?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
        } else {
            isCorrect = selected === q.correctAnswer;
        }

        if (isCorrect) {
            score += q.marks;
            correctCount++;
        }

        if (selected) {
            answerRecords.push({
                questionId: q.id,
                submittedValue: selected,
                isCorrect
            });
        }
    }

    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    // 3. Save attempt
    const attempt = await db.testAttempt.create({
        data: {
            studentId: userId,
            testId: test.id,
            score,
            accuracy,
            answers: {
                create: answerRecords
            }
        }
    });

    revalidatePath("/student/dashboard");
    return { attemptId: attempt.id };
}
