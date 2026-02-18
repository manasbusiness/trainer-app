import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminTestResultsPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params;
    const attempts = await db.testAttempt.findMany({
        where: { testId },
        include: { student: true },
        orderBy: { createdAt: "desc" }
    });

    const test = await db.test.findUnique({ where: { id: testId } });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Results: {test?.title || "Test not found"}</h1>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Accuracy</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attempts.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center">No attempts found.</TableCell></TableRow>
                        ) : (
                            attempts.map(a => (
                                <TableRow key={a.id}>
                                    <TableCell className="font-medium">{a.student.name}</TableCell>
                                    <TableCell>{a.student.email}</TableCell>
                                    <TableCell>{a.score}</TableCell>
                                    <TableCell>{a.accuracy.toFixed(1)}%</TableCell>
                                    <TableCell>{a.createdAt.toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
