import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Eye, List } from "lucide-react";

async function getTests() {
    return await db.test.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { questions: true, attempts: true } } }
    });
}

export default async function TestsPage() {
    const tests = await getTests();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tests</h1>
                <Button asChild>
                    <Link href="/admin/tests/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Test
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Duration (mins)</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead>Attempts</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No tests found.</TableCell>
                            </TableRow>
                        ) : (
                            tests.map((test) => (
                                <TableRow key={test.id}>
                                    <TableCell className="font-medium">{test.title}</TableCell>
                                    <TableCell>{test.duration}</TableCell>
                                    <TableCell>{test._count.questions}</TableCell>
                                    <TableCell>{test._count.attempts}</TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/admin/tests/${test.id}/questions`}>
                                                <List className="mr-2 h-4 w-4" /> Questions
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/tests/${test.id}/results`}>
                                                <Eye className="mr-2 h-4 w-4" /> Results
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
