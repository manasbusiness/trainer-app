import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/auth"; // Need to get userId
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getHistory(userId: string) {
    return await db.testAttempt.findMany({
        where: { studentId: userId },
        include: { test: true },
        orderBy: { createdAt: "desc" }
    });
}

export default async function AnalyticsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("refresh_token")?.value;
    let userId = "";
    if (token) {
        const payload = await verifyRefreshToken(token);
        if (payload && typeof payload.userId === 'string') userId = payload.userId;
    }

    if (!userId) return <div>Login required</div>;

    const history = await getHistory(userId);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Performance Analytics</h1>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader><CardTitle>Test History</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Test</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Accuracy</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.length === 0 ? (
                                    <TableRow><TableCell colSpan={4}>No attempts yet.</TableCell></TableRow>
                                ) : (
                                    history.map(h => (
                                        <TableRow key={h.id}>
                                            <TableCell>{h.test.title}</TableCell>
                                            <TableCell>{h.createdAt.toLocaleDateString()}</TableCell>
                                            <TableCell>{h.score} / {h.test.totalMarks}</TableCell>
                                            <TableCell className={h.accuracy >= 70 ? "text-green-600" : "text-yellow-600"}>
                                                {h.accuracy.toFixed(1)}%
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost" asChild>
                                                    <Link href={`/student/tests/${h.test.id}/results/${h.id}`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Analysis
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
