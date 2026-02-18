"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTest } from "@/app/actions/test-actions"; // server action

export default function CreateTestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        try {
            const title = formData.get("title") as string;
            const description = formData.get("description") as string;
            const duration = parseInt(formData.get("duration") as string);
            const totalMarks = parseInt(formData.get("totalMarks") as string);

            if (!title || isNaN(duration) || isNaN(totalMarks)) {
                throw new Error("Invalid input");
            }

            // We can use a Server Action here
            await createTest({ title, description, duration, totalMarks });
            router.push("/admin/tests");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Test</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required placeholder="e.g. Mathematics Final" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Optional description..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Input id="duration" name="duration" type="number" required min="1" defaultValue="60" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalMarks">Total Marks</Label>
                                <Input id="totalMarks" name="totalMarks" type="number" required min="1" defaultValue="100" />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Test"}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
