"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateQuestion } from "@/app/actions/test-actions";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface Question {
    id: string;
    question: string;
    type: "MCQ" | "TRUE_FALSE" | "FIB" | "MATCHING";
    marks: number;
    correctAnswer: string | null;
    explanation: string | null;
    options: { id: string; text: string; isCorrect: boolean }[];
}

export function EditQuestionDialog({ question, testId }: { question: Question; testId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Extract options or defaults
    const optionA = question.options[0]?.text || "";
    const optionB = question.options[1]?.text || "";
    const optionC = question.options[2]?.text || "";
    const optionD = question.options[3]?.text || "";

    // Determine correct option if MCQ
    let initialCorrectOption = question.correctAnswer || "";
    if (question.type === "MCQ") {
        // Map text back to A/B/C/D if correct answer is stored as text
        // Or if correct is stored as 'Option A', handle that.
        // Assuming simple mapping for now based on index if text matches
        if (question.correctAnswer === optionA) initialCorrectOption = "A";
        else if (question.correctAnswer === optionB) initialCorrectOption = "B";
        else if (question.correctAnswer === optionC) initialCorrectOption = "C";
        else if (question.correctAnswer === optionD) initialCorrectOption = "D";
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const qContent = formData.get("question") as string;
        const marks = parseInt(formData.get("marks") as string);

        // For MCQ
        const optA = formData.get("optionA") as string;
        const optB = formData.get("optionB") as string;
        const optC = formData.get("optionC") as string;
        const optD = formData.get("optionD") as string;
        const correctOpt = formData.get("correctOption") as string;

        try {
            await updateQuestion(question.id, testId, {
                question: qContent,
                marks,
                optionA: optA,
                optionB: optB,
                optionC: optC,
                optionD: optD,
                correctOption: correctOpt
            });
            toast.success("Question updated successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update question");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                    <DialogDescription>
                        Update question details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="question" className="text-right">
                            Question
                        </Label>
                        <Textarea
                            id="question"
                            name="question"
                            defaultValue={question.question}
                            className="col-span-3"
                            required
                        />
                    </div>
                    {/* Only showing MCQ fields for simplicity as per existing add dialog */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="optionA" className="text-right">Option A</Label>
                        <Input id="optionA" name="optionA" defaultValue={optionA} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="optionB" className="text-right">Option B</Label>
                        <Input id="optionB" name="optionB" defaultValue={optionB} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="optionC" className="text-right">Option C</Label>
                        <Input id="optionC" name="optionC" defaultValue={optionC} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="optionD" className="text-right">Option D</Label>
                        <Input id="optionD" name="optionD" defaultValue={optionD} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="correctOption" className="text-right">Correct</Label>
                        <div className="col-span-3">
                            <Select name="correctOption" defaultValue={initialCorrectOption} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select correct option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Option A</SelectItem>
                                    <SelectItem value="B">Option B</SelectItem>
                                    <SelectItem value="C">Option C</SelectItem>
                                    <SelectItem value="D">Option D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="marks" className="text-right">Marks</Label>
                        <Input id="marks" name="marks" type="number" defaultValue={question.marks} className="col-span-3" required />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
