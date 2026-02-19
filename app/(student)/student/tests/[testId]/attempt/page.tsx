import { db } from "@/lib/db";
import { TestRunner } from "@/components/test-runner";
import { notFound } from "next/navigation";

export default async function TestAttemptPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params;
    const test = await db.test.findUnique({
        where: { id: testId },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    if (!test) notFound();

    return (
        <div className="container mx-auto py-6">
            <TestRunner
                testId={test.id}
                questions={test.questions}
                duration={test.duration}
            />
        </div>
    );
}
