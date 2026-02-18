import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, HelpCircle, AlertCircle } from "lucide-react";

export default async function TestInstructionsPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params;
    const test = await db.test.findUnique({
        where: { id: testId },
        include: { _count: { select: { questions: true } } }
    });

    if (!test) return <div>Test not found</div>;

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-4 border rounded-lg">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-bold">{test.duration} minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-4 border rounded-lg">
                            <HelpCircle className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Questions</p>
                                <p className="font-bold">{test._count.questions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Instructions</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            <li>The test will automatically submit when the timer ends.</li>
                            <li>You can navigate between questions freely.</li>
                            <li>Ensure you have a stable internet connection.</li>
                            <li>Do not refresh the page during the test.</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="outline" asChild>
                        <Link href="/student/tests">Cancel</Link>
                    </Button>
                    <Button size="lg" asChild>
                        <Link href={`/student/tests/${test.id}/attempt`}>Start Test Now</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
