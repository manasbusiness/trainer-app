import { db } from "@/lib/db";
import { AddQuestionDialog } from "@/components/add-question-dialog";
import { EditQuestionDialog } from "@/components/edit-question-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteQuestion } from "@/app/actions/test-actions";

import { BulkQuestionUpload } from "@/components/bulk-question-upload";

export default async function QuestionsPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params;
    const test = await db.test.findUnique({
        where: { id: testId },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        },
    });

    if (!test) return <div>Test not found</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{test.title} - Questions</h1>
                    <p className="text-muted-foreground">{test.description}</p>
                </div>
                <div className="flex gap-2">
                    <BulkQuestionUpload testId={test.id} />
                    <AddQuestionDialog testId={test.id} />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%]">Question</TableHead>
                            <TableHead>Correct Option</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {test.questions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No questions added yet.</TableCell>
                            </TableRow>
                        ) : (
                            test.questions.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell className="font-medium whitespace-pre-wrap">{q.question}</TableCell>
                                    <TableCell>{q.correctAnswer}</TableCell>
                                    <TableCell>{q.marks}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <EditQuestionDialog question={q} testId={test.id} />
                                            <form action={deleteQuestion.bind(null, q.id, test.id)}>
                                                <Button variant="destructive" size="icon" type="submit">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
