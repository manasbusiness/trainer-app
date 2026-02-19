import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, ShieldCheck, TrendingUp, Plus } from "lucide-react";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getStats() {
    const studentsCount = await db.user.count({ where: { role: "STUDENT" } });
    const testsCount = await db.test.count();
    const attemptsCount = await db.testAttempt.count();

    return { studentsCount, testsCount, attemptsCount };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-vega-gray-700 dark:text-foreground">Admin Dashboard</h1>
                    <p className="text-sm text-vega-gray-600 dark:text-muted-foreground mt-1">Manage platform activity and resources.</p>
                </div>
                <Button asChild size="sm">
                    <Link href="/admin/tests/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Test
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-vega-gray-600 dark:text-muted-foreground">
                            Total Students
                        </CardTitle>
                        <Users className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-vega-gray-700 dark:text-foreground">{stats.studentsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-vega-gray-600 dark:text-muted-foreground">
                            Active Tests
                        </CardTitle>
                        <FileText className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-vega-gray-700 dark:text-foreground">{stats.testsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Published assessments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-vega-gray-600 dark:text-muted-foreground">
                            Total Attempts
                        </CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-vega-gray-700 dark:text-foreground">{stats.attemptsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Student submissions
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Recent Activity could go here - placeholder for now to keep it clean */}
            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/admin/students" className="block group">
                    <Card className="h-full hover:border-vega-blue-500 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-500" />
                                Manage Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">View student list, progress, and accounts.</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/tests" className="block group">
                    <Card className="h-full hover:border-vega-blue-500 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-5 w-5 text-purple-500" />
                                Manage Tests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Create, edit, or delete tests.</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
