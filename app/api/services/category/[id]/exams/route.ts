/*
    This is route show all exam type in this category, the category id is passed in the url as a parameter. The route will return a list of exams that belong to the specified category. If no exams are found, it will return a 404 error. If there is an error fetching the exams, it will return a 500 error.
 */

import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase-client";
import { ref, get } from "firebase/database";

type Exam = {
    categoryId?: string;
};

function toArray<T>(value: T[] | Record<string, T>) {
    return Array.isArray(value) ? value : Object.values(value);
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const snapshot = await get(
            ref(rtdb, `data/exams`)
        );

        if (!snapshot.exists()) {
            return NextResponse.json(
                { error: "No exams found" },
                { status: 404 }
            );
        }

        // filter exams by category ID
        const exams = toArray(snapshot.val() as Exam[] | Record<string, Exam>);
        const filteredExams = exams.filter((exam) => exam.categoryId === id);

        return NextResponse.json({
            id,
            data: filteredExams,
        });
    } catch (error) {
        console.error("Error fetching exams:", error);

        return NextResponse.json(
            { error: "Failed to fetch exams" },
            { status: 500 }
        );
    }
}
