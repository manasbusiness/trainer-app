import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Play } from "lucide-react";

async function getAvailableTests() {
    return await db.test.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { questions: true } } }
    });
}

export default async function StudentTestsPage() {
    const tests = await getAvailableTests();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Available Tests</h1>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test Title</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead>Total Marks</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No tests available.</TableCell>
                            </TableRow>
                        ) : (
                            tests.map((test) => (
                                <TableRow key={test.id}>
                                    <TableCell className="font-medium">{test.title}</TableCell>
                                    <TableCell>{test.duration} mins</TableCell>
                                    <TableCell>{test._count.questions}</TableCell>
                                    <TableCell>{test.totalMarks}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" asChild>
                                            <Link href={`/student/tests/${test.id}/instructions`}>
                                                <Play className="mr-2 h-4 w-4" /> Start
                                            </Link>
                                        </Button>
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
