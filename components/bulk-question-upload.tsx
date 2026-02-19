"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface BulkQuestionUploadProps {
    testId: string;
}

export function BulkQuestionUpload({ testId }: BulkQuestionUploadProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();

    const handleDownloadTemplate = () => {
        const headers = ["Content", "Type", "Marks", "Option A", "Option B", "Option C", "Option D", "Correct Answer", "Explanation"];
        const exampleRows = [
            ["What is the capital of France?", "MCQ", 2, "London", "Paris", "Berlin", "Madrid", "Paris", "Geography Check"],
            ["The earth is flat.", "TRUE_FALSE", 1, "", "", "", "", "FALSE", "Basic Science"],
            ["The chemical symbol for water is ___", "FIB", 2, "", "", "", "", "H2O", "Chemistry"],
            ["Match the countries", "MATCHING", 4, "France -> Paris", "Japan -> Tokyo", "USA -> DC", "India -> Delhi", "", "Capitals"]
        ];

        const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "master_question_template.xlsx");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setValidationErrors([]);
            setSuccessMessage("");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        setValidationErrors([]);
        setSuccessMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`/api/admin/tests/${testId}/import`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    setValidationErrors(data.errors);
                } else {
                    setValidationErrors([data.message || "Something went wrong"]);
                }
            } else {
                setSuccessMessage(`Successfully imported ${data.count} questions!`);
                setFile(null);
                router.refresh(); // Refresh the page to show new questions
                // Optional: Close dialog after delay
                // setTimeout(() => setOpen(false), 2000);
            }
        } catch (error) {
            setValidationErrors(["Failed to upload file. Please try again."]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Import Questions
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Bulk Upload Questions</DialogTitle>
                    <DialogDescription>
                        Upload an Excel file to bulk import questions.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Step 1: Download Template */}
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2 border border-dashed">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                            Download Template
                        </div>
                        <p className="text-xs text-muted-foreground pl-8">
                            Start by downloading the Excel template to ensure your data is formatted correctly.
                        </p>
                        <div className="pl-8">
                            <Button variant="secondary" size="sm" onClick={handleDownloadTemplate}>
                                <Download className="mr-2 h-3.5 w-3.5" /> Download .xlsx
                            </Button>
                        </div>
                    </div>

                    {/* Step 2: Upload File */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                            Upload Filled Template
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 pl-8">
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Feedback Area */}
                    {validationErrors.length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Upload Failed</AlertTitle>
                            <AlertDescription>
                                <ScrollArea className="h-[100px] w-full mt-2">
                                    <ul className="list-disc pl-4 text-xs space-y-1">
                                        {validationErrors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </AlertDescription>
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert className="border-green-500 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpload} disabled={!file || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Uploading..." : "Import Questions"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
