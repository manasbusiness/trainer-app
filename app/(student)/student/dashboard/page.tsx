import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trophy, Target, TrendingUp, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getStudentStats(userId: string) {
    try {
        const attempts = await db.testAttempt.findMany({
            where: { studentId: userId }
        });

        const totalAttempts = attempts.length;
        let totalScore = 0;
        let totalAccuracy = 0;

        attempts.forEach(a => {
            totalScore += a.score;
            totalAccuracy += a.accuracy;
        });

        const avgScore = totalAttempts > 0 ? totalScore / totalAttempts : 0;
        const avgAccuracy = totalAttempts > 0 ? totalAccuracy / totalAttempts : 0;
        const availableTestsCount = await db.test.count();

        return { totalAttempts, avgScore, avgAccuracy, availableTestsCount };
    } catch (e) {
        console.error("Failed to fetch stats", e);
        return { totalAttempts: 0, avgScore: 0, avgAccuracy: 0, availableTestsCount: 0 };
    }
}

export default async function StudentDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("refresh_token")?.value;
    let userId = "";

    if (token) {
        const payload = await verifyRefreshToken(token);
        if (payload && typeof payload.userId === 'string') {
            userId = payload.userId;
        }
    }

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Please log in to view dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground">Access your personalized learning dashboard</p>
                    <Button asChild className="mt-4">
                        <Link href="/login">Login Now</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const stats = await getStudentStats(userId);

    return (
        <div className="space-y-4">
            {/* Stats Grid - Compact */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Tests Attempted Card */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-3xl opacity-20 -mr-12 -mt-12" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Tests Attempted
                        </CardTitle>
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                            <FileText className="h-3.5 w-3.5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAttempts}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Keep testing
                        </p>
                    </CardContent>
                </Card>

                {/* Average Score Card */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full blur-3xl opacity-20 -mr-12 -mt-12" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Average Score
                        </CardTitle>
                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                            <Trophy className="h-3.5 w-3.5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgScore.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Doing great!
                        </p>
                    </CardContent>
                </Card>

                {/* Accuracy Card */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-3xl opacity-20 -mr-12 -mt-12" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Accuracy Rate
                        </CardTitle>
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                            <Target className="h-3.5 w-3.5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgAccuracy.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Precision matters
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions - Compact */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                    <Link href="/student/tests" className="group">
                        <div className="p-4 rounded-lg border-2 border-purple-200 hover:border-purple-400 bg-card transition-all hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-sm group-hover:bg-purple-200 transition-colors">
                                    <BookOpen className="h-4 w-4 text-purple-100 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Available Tests</h3>
                                    <p className="text-xs text-muted-foreground">{stats.availableTestsCount} tests ready</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <Link href="/student/analytics" className="group">
                        <div className="p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 bg-card transition-all hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-sm group-hover:bg-blue-200 transition-colors">
                                    <TrendingUp className="h-4 w-4 text-blue-100 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Analytics</h3>
                                    <p className="text-xs text-muted-foreground">Track performance</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
