import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getStudents() {
    return await db.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" },
    });
}

export default async function StudentsPage() {
    const students = await getStudents();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Students</h1>
                <Button asChild>
                    <Link href="/admin/students/create">
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No students found.</TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/students/${student.id}`}>Edit</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
