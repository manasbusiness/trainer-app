"use client";

import { useEffect } from "react";
import { useTestStore } from "@/store/test-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Need to create RadioGroup or use native input
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { submitTestAttempt } from "@/app/actions/attempt-actions";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";

// Helper for formatting time
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TestRunner({ testId, questions, duration }: { testId: string, questions: any[], duration: number }) {
    const router = useRouter();
    const {
        currentQuestionIndex,
        questions: storeQuestions,
        answers,
        timeLeft,
        initialize,
        setAnswer,
        setCurrentQuestion,
        tick,
        isSubmitting,
        setSubmitting
    } = useTestStore();

    // Initialize store
    useEffect(() => {
        initialize(questions, duration);
    }, [questions, duration, initialize]);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(timer);
    }, [tick]);

    // Auto submit
    useEffect(() => {
        if (timeLeft === 0 && storeQuestions.length > 0 && !isSubmitting) {
            console.log("Time up! Auto submitting...");
            handleSubmit();
        }
    }, [timeLeft, storeQuestions.length, isSubmitting]);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setSubmitting(true);
        try {
            const result = await submitTestAttempt(testId, useTestStore.getState().answers);
            router.push(`/student/tests/${testId}/results/${result.attemptId}`);
        } catch (error) {
            console.error(error);
            alert("Failed to submit test. Please try again.");
            setSubmitting(false);
        }
    };

    if (storeQuestions.length === 0) return <div>Loading test...</div>;

    const currentQuestion = storeQuestions[currentQuestionIndex];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Question {currentQuestionIndex + 1} of {storeQuestions.length}</CardTitle>
                        <div className="flex items-center gap-2 text-xl font-mono font-bold text-primary">
                            <Clock className="h-5 w-5" />
                            {formatTime(timeLeft)}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-lg font-medium whitespace-pre-wrap">{currentQuestion.question}</p>

                        <div className="space-y-4">
                            {/* MCQ & TRUE_FALSE */}
                            {(currentQuestion.type === "MCQ" || currentQuestion.type === "TRUE_FALSE") && (
                                <div className="space-y-3">
                                    {currentQuestion.options?.map((option: any) => {
                                        const isSelected = answers[currentQuestion.id] === option.id; // Use Option ID
                                        return (
                                            <div
                                                key={option.id}
                                                className={cn(
                                                    "flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                                                    isSelected && "border-primary bg-primary/5"
                                                )}
                                                onClick={() => setAnswer(currentQuestion.id, option.id)}
                                            >
                                                <div className={cn(
                                                    "h-5 w-5 rounded-full border border-primary flex items-center justify-center",
                                                    isSelected && "bg-primary text-primary-foreground"
                                                )}>
                                                    {isSelected && <div className="h-2.5 w-2.5 bg-white rounded-full" />}
                                                </div>
                                                <span className="flex-1">{option.text}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* FILL IN THE BLANKS */}
                            {currentQuestion.type === "FIB" && (
                                <div className="space-y-2">
                                    <Label htmlFor={`fib-${currentQuestion.id}`}>Your Answer</Label>
                                    <input
                                        id={`fib-${currentQuestion.id}`}
                                        type="text"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Type your answer here..."
                                        value={answers[currentQuestion.id] || ""}
                                        onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                                    />
                                </div>
                            )}

                            {/* MATCHING - Simplified View for now */}
                            {currentQuestion.type === "MATCHING" && (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">Match the items correctly:</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="font-semibold text-sm text-center border-b pb-2">Item</div>
                                        <div className="font-semibold text-sm text-center border-b pb-2">Match</div>

                                        {currentQuestion.options?.map((option: any) => (
                                            <>
                                                <div className="p-3 bg-muted/30 rounded-md flex items-center">{option.text}</div>
                                                <div className="p-3 border rounded-md border-dashed flex items-center justify-center text-muted-foreground text-sm">
                                                    {/* Placeholder for Drag Drop or Dropdown logic */}
                                                    {option.matchText} (Drag here)
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                    <div className="p-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                                        Matching interaction under development. (Displays pairs for now)
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestionIndex - 1))}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>
                        {currentQuestionIndex === storeQuestions.length - 1 ? (
                            <Button onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Test"}
                            </Button>
                        ) : (
                            <Button onClick={() => setCurrentQuestion(Math.min(storeQuestions.length - 1, currentQuestionIndex + 1))}>
                                Next
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Question Palette</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                            {storeQuestions.map((q, idx) => {
                                const isAnswered = !!answers[q.id];
                                const isCurrent = idx === currentQuestionIndex;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestion(idx)}
                                        className={cn(
                                            "h-8 w-8 text-xs font-medium rounded flex items-center justify-center transition-colors",
                                            isCurrent ? "ring-2 ring-primary ring-offset-2" : "",
                                            isAnswered ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                                        )}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
                            Finish Test
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
