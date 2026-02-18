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
import { addQuestion } from "@/app/actions/test-actions";

export function AddQuestionDialog({ testId }: { testId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const question = formData.get("question") as string;
        const optionA = formData.get("optionA") as string;
        const optionB = formData.get("optionB") as string;
        const optionC = formData.get("optionC") as string;
        const optionD = formData.get("optionD") as string;
        const correctOption = formData.get("correctOption") as string;
        const marks = parseInt(formData.get("marks") as string);

        await addQuestion(testId, {
            question, optionA, optionB, optionC, optionD, correctOption, marks
        });

        setLoading(false);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Question</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Add Question</DialogTitle>
                    <DialogDescription>
                        Add a new question to this test.
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
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="optionA" className="text-right">Option A</Label>
                        <Input id="optionA" name="optionA" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="optionB" className="text-right">Option B</Label>
                        <Input id="optionB" name="optionB" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="optionC" className="text-right">Option C</Label>
                        <Input id="optionC" name="optionC" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="optionD" className="text-right">Option D</Label>
                        <Input id="optionD" name="optionD" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="correctOption" className="text-right">Correct</Label>
                        <div className="col-span-3">
                            <Select name="correctOption" required>
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
                        <Input id="marks" name="marks" type="number" defaultValue="1" className="col-span-3" required />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Question"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
