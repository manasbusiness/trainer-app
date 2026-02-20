import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AnalysisPage({ params }: { params: Promise<{ testId: string, attemptId: string }> }) {
    const { testId, attemptId } = await params;
    const attempt = await db.testAttempt.findUnique({
        where: { id: attemptId },
        include: {
            test: { include: { questions: { include: { options: true } } } },
            answers: true
        }
    });

    if (!attempt) return <div>Attempt not found</div>;

    const answerMap = new Map(attempt.answers.map(a => [a.questionId, a]));

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Detailed Analysis</h1>
                <Button variant="outline" asChild>
                    <Link href={`/student/tests/${testId}/results/${attemptId}`}>Back to Result</Link>
                </Button>
            </div>

            <div className="space-y-6">
                {attempt.test.questions.map((q, idx) => {
                    const answer = answerMap.get(q.id);
                    const isCorrect = answer?.isCorrect;
                    const isSkipped = !answer;
                    const userAnswer = answer?.submittedValue;

                    return (
                        <Card key={q.id} className={cn("border-l-4", isCorrect ? "border-l-green-500" : isSkipped ? "border-l-gray-300" : "border-l-red-500")}>
                            <CardHeader>
                                <CardTitle className="flex justify-between text-base">
                                    <span>Question {idx + 1}</span>
                                    {isCorrect && <span className="text-green-600 text-sm flex items-center gap-1"><Check className="h-4 w-4" /> Correct</span>}
                                    {!isCorrect && !isSkipped && <span className="text-red-600 text-sm flex items-center gap-1"><X className="h-4 w-4" /> Wrong</span>}
                                    {isSkipped && <span className="text-gray-500 text-sm">Skipped</span>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="font-medium whitespace-pre-wrap">{q.question}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {['A', 'B', 'C', 'D'].map((opt, oIdx) => {
                                        const option = q.options[oIdx];
                                        if (!option) return null;

                                        const val = option.text;
                                        const isSelected = userAnswer === option.id;
                                        const isRightOption = option.isCorrect;

                                        let style = "border p-3 rounded-md";
                                        if (isSelected && isRightOption) style += " bg-green-100 border-green-500 dark:bg-green-900";
                                        else if (isSelected && !isRightOption) style += " bg-red-100 border-red-500 dark:bg-red-900";
                                        else if (isRightOption) style += " bg-green-50 border-green-300 dark:bg-green-900/50";

                                        return (
                                            <div key={opt} className={style}>
                                                <span className="font-bold mr-2">{opt}.</span> {val}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="text-sm text-muted-foreground mt-2">
                                    Right Answer: <span className="font-bold">{q.options.find((o: any) => o.isCorrect)?.text || q.correctAnswer}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
