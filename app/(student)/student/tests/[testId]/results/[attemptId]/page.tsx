import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ResultPage({ params }: { params: Promise<{ testId: string, attemptId: string }> }) {
    const { attemptId } = await params;
    const attempt = await db.testAttempt.findUnique({
        where: { id: attemptId },
        include: { test: { include: { questions: true } } }
    });

    if (!attempt) notFound();

    const totalQuestions = attempt.test.questions.length;
    // We can calculate correct/wrong from score or re-verify answers.
    // Ideally we should have stored `correctCount` in DB or calculate it here.
    // Since we only stored score, let's roughly calculate.
    // Actually, let's fetch answers from DB to be precise.
    const answers = await db.answer.findMany({
        where: { attemptId: attempt.id }
    });

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const wrongAnswers = answers.filter(a => !a.isCorrect).length;
    const skipped = totalQuestions - answers.length;

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="flex flex-col items-center gap-6">
                <Trophy className="h-16 w-16 text-yellow-500" />
                <h1 className="text-3xl font-bold">Test Completed!</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <Card className="text-center">
                        <CardHeader><CardTitle>Score</CardTitle></CardHeader>
                        <CardContent>
                            <span className="text-4xl font-bold text-primary">{attempt.score}</span>
                            <span className="text-muted-foreground"> / {attempt.test.totalMarks}</span>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader><CardTitle>Accuracy</CardTitle></CardHeader>
                        <CardContent>
                            <span className="text-4xl font-bold text-blue-500">{attempt.accuracy.toFixed(1)}%</span>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader><CardTitle>Questions</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex justify-center gap-4 text-sm font-medium">
                                <div className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4" /> {correctAnswers}</div>
                                <div className="flex items-center gap-1 text-red-600"><XCircle className="h-4 w-4" /> {wrongAnswers}</div>
                                <div className="flex items-center gap-1 text-gray-500">Skipped: {skipped}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/student/dashboard">Back to Dashboard</Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/student/tests/${attempt.testId}/results/${attempt.id}/analysis`}>View Detailed Analysis</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
