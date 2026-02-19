import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { QuestionType } from "@prisma/client";
import * as XLSX from "xlsx";
import { z } from "zod";

const questionSchema = z.object({
    content: z.string().min(1, "Question content is required"),
    type: z.enum(["MCQ", "TRUE_FALSE", "FIB", "MATCHING"]),
    marks: z.number().int().positive("Marks must be a positive integer"),
    correctAnswer: z.string().min(1, "Correct answer is required"),
    explanation: z.string().optional(),

    // Array of option strings collected from dynamic columns
    options: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ testId: string }> }) {
    try {
        const { testId } = await params;
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
            return NextResponse.json({ message: "File is empty" }, { status: 400 });
        }

        const errors: string[] = [];
        const validQuestions: any[] = [];

        // Validate each row
        jsonData.forEach((row: any, index: number) => {
            const rowNum = index + 2;
            try {
                // Normalize keys & Collect dynamic options
                const normalizedRow: any = {};
                const dynamicOptions: { key: string, value: string }[] = [];

                Object.keys(row).forEach(key => {
                    const cleanKey = key.trim().toLowerCase().replace(/\s+/g, "");
                    const value = row[key];

                    // Check for "Option" prefix (e.g., "Option A", "Option 1", "Option")
                    if (cleanKey.startsWith("option")) {
                        if (value && value.toString().trim().length > 0) {
                            dynamicOptions.push({ key: cleanKey, value: value.toString().trim() });
                        }
                    } else {
                        // Map standard fields
                        if (cleanKey === "question" || cleanKey === "questiontext" || cleanKey === "content") normalizedRow.content = value;
                        if (cleanKey === "type") normalizedRow.type = value;
                        if (cleanKey === "mark" || cleanKey === "marks") normalizedRow.marks = value;
                        if (cleanKey === "answer" || cleanKey === "correct" || cleanKey === "correctanswer") normalizedRow.correctanswer = value;
                        if (cleanKey === "explanation") normalizedRow.explanation = value;
                    }
                });

                // Sort options to ensure A, B, C order if user used Option A, Option B columns
                // Simple alphanumeric sort on the normalized keys ("optiona", "optionb", "option1", "option2")
                dynamicOptions.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: 'base' }));
                const finalOptionsList = dynamicOptions.map(o => o.value);

                // Default Type
                const type = (normalizedRow.type || "MCQ").toUpperCase();

                const rawObj = {
                    content: normalizedRow.content,
                    type: type,
                    marks: Number(normalizedRow.marks) || 1,
                    correctAnswer: normalizedRow.correctanswer?.toString() || "",
                    explanation: normalizedRow.explanation?.toString() || "",
                    options: finalOptionsList
                };

                const parseResult = questionSchema.safeParse(rawObj);

                if (!parseResult.success) {
                    parseResult.error.issues.forEach((err) => {
                        errors.push(`Row ${rowNum}: ${err.message}`);
                    });
                    return;
                }

                const data = parseResult.data;
                let parsedOptions: any[] = [];

                if (data.type === "MCQ") {
                    if (!data.options || data.options.length < 2) {
                        errors.push(`Row ${rowNum}: MCQ requires at least 2 options (Option A, Option B...)`);
                        return;
                    }

                    const correctVal = data.correctAnswer.trim();
                    let matchedCorrect = false;

                    parsedOptions = data.options.map((text, idx) => {
                        // Check against A, B, C labels OR exact text match
                        const optLabel = String.fromCharCode(65 + idx); // A, B, C...
                        const isCorrect = (correctVal.toUpperCase() === optLabel) || (text.trim() === correctVal);
                        if (isCorrect) matchedCorrect = true;

                        return { text: text.trim(), isCorrect };
                    });

                    if (!matchedCorrect) {
                        errors.push(`Row ${rowNum}: Correct answer '${correctVal}' must match one of the provided options or their labels (A, B, C...)`);
                        return;
                    }

                } else if (data.type === "TRUE_FALSE") {
                    const correctVal = data.correctAnswer.trim().toUpperCase();
                    if (correctVal !== "TRUE" && correctVal !== "FALSE") {
                        errors.push(`Row ${rowNum}: Correct answer for TRUE_FALSE must be 'TRUE' or 'FALSE'`);
                        return;
                    }
                    parsedOptions = [
                        { text: "TRUE", isCorrect: correctVal === "TRUE" },
                        { text: "FALSE", isCorrect: correctVal === "FALSE" }
                    ];

                } else if (data.type === "FIB") {
                    parsedOptions = [
                        { text: data.correctAnswer.trim(), isCorrect: true }
                    ];

                } else if (data.type === "MATCHING") {
                    if (!data.options || data.options.length < 2) {
                        errors.push(`Row ${rowNum}: MATCHING requires at least 2 pairs defined in Option columns`);
                        return;
                    }

                    parsedOptions = data.options.map(opt => {
                        const parts = opt.split("->").map(s => s.trim());
                        if (parts.length !== 2) {
                            errors.push(`Row ${rowNum}: Invalid Matching format in option: '${opt}'. Use 'Key -> Value'`);
                            return null;
                        }
                        return { text: parts[0], matchText: parts[1], isCorrect: true };
                    }).filter(o => o !== null);

                    if (errors.length > 0 && errors[errors.length - 1].includes("Invalid Matching")) return;
                }

                validQuestions.push({
                    ...data,
                    parsedOptions
                });

            } catch (err: any) {
                errors.push(`Row ${rowNum}: Unexpected error - ${err.message}`);
            }
        });

        if (errors.length > 0) {
            return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
        }

        // Database Insertion (Transaction)
        let importedCount = 0;
        await db.$transaction(async (tx) => {
            for (const q of validQuestions) {
                const createdQuestion = await tx.question.create({
                    data: {
                        testId: testId,
                        question: q.content,
                        type: q.type as QuestionType,
                        marks: q.marks,
                        correctAnswer: q.correctAnswer, // Store raw text for FIB
                        explanation: q.explanation
                    }
                });

                if (q.parsedOptions.length > 0) {
                    await tx.option.createMany({
                        data: q.parsedOptions.map((opt: any) => ({
                            questionId: createdQuestion.id,
                            text: opt.text,
                            matchText: opt.matchText,
                            isCorrect: opt.isCorrect
                        }))
                    });
                }
                importedCount++;
            }
        }, {
            maxWait: 10000,
            timeout: 60000
        });

        return NextResponse.json({ message: "Import successful", count: importedCount });

    } catch (error: any) {
        console.error("Import Error Full:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message, stack: error.stack }, { status: 500 });
    }
}
