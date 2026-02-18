import {
    DataTable,
    DataTableHeader,
    DataTableBody,
    DataTableRow,
    DataTableHead,
    DataTableCell,
    StatusBadge,
} from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboard() {
    // Sample data
    const recentTests = [
        {
            id: 1,
            name: "JavaScript Fundamentals",
            type: "Multiple Choice",
            status: "done" as const,
            score: 85,
            maxScore: 100,
            reviewer: "John Smith",
        },
        {
            id: 2,
            name: "React Components",
            type: "Coding",
            status: "in-progress" as const,
            score: 45,
            maxScore: 100,
            reviewer: "Sarah Johnson",
        },
        {
            id: 3,
            name: "TypeScript Basics",
            type: "Multiple Choice",
            status: "done" as const,
            score: 92,
            maxScore: 100,
            reviewer: "Mike Davis",
        },
        {
            id: 4,
            name: "Node.js APIs",
            type: "Project",
            status: "in-progress" as const,
            score: 60,
            maxScore: 100,
            reviewer: "Emily Brown",
        },
        {
            id: 5,
            name: "Database Design",
            type: "Theory",
            status: "pending" as const,
            score: 0,
            maxScore: 100,
            reviewer: "Assign reviewer",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-vega-gray-700 dark:text-foreground">Dashboard</h1>
                <p className="text-sm text-vega-gray-600 dark:text-muted-foreground mt-1">Welcome back! Here's your learning progress.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-vega-gray-600 dark:text-muted-foreground">Tests Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-vega-gray-700 dark:text-foreground">12</div>
                        <p className="text-xs text-vega-gray-500 mt-1 dark:text-muted-foreground">+2 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-vega-gray-600 dark:text-muted-foreground">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-vega-gray-700 dark:text-foreground">87%</div>
                        <p className="text-xs text-vega-gray-500 mt-1 dark:text-muted-foreground">+5% improvement</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-vega-gray-600 dark:text-muted-foreground">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-vega-gray-700 dark:text-foreground">3</div>
                        <p className="text-xs text-vega-gray-500 mt-1 dark:text-muted-foreground">Complete them soon</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Tests Table */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-vega-gray-700 dark:text-foreground">Recent Tests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable>
                        <DataTableHeader>
                            <DataTableRow>
                                <DataTableHead className="w-8">#</DataTableHead>
                                <DataTableHead>Test Name</DataTableHead>
                                <DataTableHead>Type</DataTableHead>
                                <DataTableHead>Status</DataTableHead>
                                <DataTableHead className="text-right">Score</DataTableHead>
                                <DataTableHead className="text-right">Max</DataTableHead>
                                <DataTableHead>Reviewer</DataTableHead>
                            </DataTableRow>
                        </DataTableHeader>
                        <DataTableBody>
                            {recentTests.map((test, index) => (
                                <DataTableRow key={test.id}>
                                    <DataTableCell className="text-vega-gray-400 font-mono text-xs dark:text-muted-foreground">
                                        {index + 1}
                                    </DataTableCell>
                                    <DataTableCell className="font-medium text-vega-gray-700 dark:text-foreground">
                                        {test.name}
                                    </DataTableCell>
                                    <DataTableCell className="text-vega-gray-500 dark:text-muted-foreground">
                                        {test.type}
                                    </DataTableCell>
                                    <DataTableCell>
                                        <StatusBadge status={test.status}>
                                            {test.status === "done" && "Done"}
                                            {test.status === "in-progress" && "In Progress"}
                                            {test.status === "pending" && "Pending"}
                                        </StatusBadge>
                                    </DataTableCell>
                                    <DataTableCell className="text-right font-medium">
                                        {test.score}
                                    </DataTableCell>
                                    <DataTableCell className="text-right text-vega-gray-500 dark:text-muted-foreground">
                                        {test.maxScore}
                                    </DataTableCell>
                                    <DataTableCell className="text-vega-blue-500">
                                        {test.reviewer}
                                    </DataTableCell>
                                </DataTableRow>
                            ))}
                        </DataTableBody>
                    </DataTable>
                </CardContent>
            </Card>
        </div>
    );
}
