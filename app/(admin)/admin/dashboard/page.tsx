import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, ShieldCheck, ChevronRight, TrendingUp } from "lucide-react";
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
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
                <p className="text-sm text-muted-foreground">Manage your platform's activity and resources.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Total Students
                        </CardTitle>
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                            <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.studentsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Active learners
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Active Tests
                        </CardTitle>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.testsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Available assessments
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Total Attempts
                        </CardTitle>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.attemptsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Engagement metrics
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Link href="/admin/tests/create" className="block group">
                    <Card className="h-full border-dashed hover:border-solid hover:border-primary transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2 h-full">
                            <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">Create New Test</h3>
                            <p className="text-sm text-muted-foreground">Draft and publish a new assessment.</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/students" className="block group">
                    <Card className="h-full border-dashed hover:border-solid hover:border-primary transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2 h-full">
                            <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">Manage Students</h3>
                            <p className="text-sm text-muted-foreground">View progress and manage accounts.</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
