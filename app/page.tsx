import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Target,
    TrendingUp,
    BarChart3,
    Clock,
    CheckCircle2,
    Award,
    Zap,
    Navigation,
    LineChart,
    Gauge,
    Layout,
    Rocket
} from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-blue-600">
                                Trainer
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#features" className="text-gray-700 hover:text-blue-600 transition">
                                Features
                            </Link>
                            <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">
                                How it Works
                            </Link>
                            <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Improve Your Test Performance with{" "}
                                <span className="text-blue-600">Smart Practice</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Attempt real tests, track your progress, and identify weak areas with detailed analytics.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="text-lg px-8" asChild>
                                    <Link href="/register">Get Started</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <Card className="shadow-2xl border-2 border-blue-100">
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <CardTitle>Student Dashboard</CardTitle>
                                    <CardDescription className="text-blue-100">Your Performance Overview</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Tests Completed</span>
                                        <span className="text-2xl font-bold text-green-600">24</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Average Score</span>
                                        <span className="text-2xl font-bold text-blue-600">85%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Improvement</span>
                                        <span className="text-2xl font-bold text-purple-600">+12%</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Trainer?</h2>
                        <p className="text-xl text-gray-600">Everything you need to excel in your exams</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card className="border-2 hover:border-blue-300 transition hover:shadow-lg">
                            <CardHeader>
                                <Target className="w-12 h-12 text-blue-600 mb-4" />
                                <CardTitle>Real Exam Simulation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Practice with tests that mirror actual exam conditions and difficulty levels.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 hover:border-green-300 transition hover:shadow-lg">
                            <CardHeader>
                                <Zap className="w-12 h-12 text-green-600 mb-4" />
                                <CardTitle>Instant Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Get immediate feedback on your performance right after completing each test.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 hover:border-purple-300 transition hover:shadow-lg">
                            <CardHeader>
                                <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
                                <CardTitle>Performance Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Detailed insights into your strengths and areas that need improvement.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 hover:border-orange-300 transition hover:shadow-lg">
                            <CardHeader>
                                <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
                                <CardTitle>Track Your Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Monitor your improvement over time with comprehensive progress tracking.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600">Get started in three simple steps</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                                1
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Create Account</h3>
                            <p className="text-gray-600">
                                Sign up for free and set up your profile in less than a minute.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                                2
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Attempt Tests</h3>
                            <p className="text-gray-600">
                                Choose from available tests and complete them at your own pace.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                                3
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">View Results and Improve</h3>
                            <p className="text-gray-600">
                                Analyze your performance and focus on areas that need improvement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                        <p className="text-xl text-gray-600">Built for serious test preparation</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-lg transition">
                            <CardHeader>
                                <Clock className="w-10 h-10 text-blue-600 mb-2" />
                                <CardTitle>Timer Based Tests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Practice under timed conditions to improve your speed and time management.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition">
                            <CardHeader>
                                <Navigation className="w-10 h-10 text-green-600 mb-2" />
                                <CardTitle>Easy Navigation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Intuitive interface makes it easy to move between questions and review answers.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition">
                            <CardHeader>
                                <LineChart className="w-10 h-10 text-purple-600 mb-2" />
                                <CardTitle>Detailed Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive breakdown of your performance across different topics.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition">
                            <CardHeader>
                                <Gauge className="w-10 h-10 text-orange-600 mb-2" />
                                <CardTitle>Accuracy Tracking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Monitor your accuracy rates and identify patterns in your mistakes.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition">
                            <CardHeader>
                                <Layout className="w-10 h-10 text-pink-600 mb-2" />
                                <CardTitle>Clean Interface</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Distraction-free design helps you focus on what matters most.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition">
                            <CardHeader>
                                <Rocket className="w-10 h-10 text-red-600 mb-2" />
                                <CardTitle>Fast Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Lightning-fast platform ensures smooth experience without delays.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Experience the Platform</h2>
                        <p className="text-xl text-gray-600">See what makes Trainer different</p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <Card className="shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <CardTitle>Student Dashboard</CardTitle>
                                <CardDescription className="text-blue-100">Track your journey</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Active Tests</span>
                                    <Award className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Performance Graph</span>
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Recent Results</span>
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardTitle>Test Attempt Interface</CardTitle>
                                <CardDescription className="text-green-100">Focused experience</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Question Navigator</span>
                                    <Navigation className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Timer Display</span>
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Submit & Review</span>
                                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                <CardTitle>Result Analytics</CardTitle>
                                <CardDescription className="text-purple-100">Detailed insights</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Score Breakdown</span>
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Topic Analysis</span>
                                    <LineChart className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">Accuracy Metrics</span>
                                    <Gauge className="w-5 h-5 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white">
                        Start Improving Your Performance Today
                    </h2>
                    <p className="text-xl text-blue-100">
                        Join Trainer and take your test preparation to the next level.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg px-12 py-6 h-auto" asChild>
                        <Link href="/register">Create Free Account</Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <Link href="/" className="text-2xl font-bold text-white">
                                Trainer
                            </Link>
                            <p className="mt-2 text-gray-400">© 2026 Trainer. All rights reserved.</p>
                        </div>
                        <div className="flex flex-wrap gap-6 md:justify-end">
                            <Link href="/login" className="hover:text-white transition">
                                Login
                            </Link>
                            <Link href="/register" className="hover:text-white transition">
                                Register
                            </Link>
                            <Link href="#" className="hover:text-white transition">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
