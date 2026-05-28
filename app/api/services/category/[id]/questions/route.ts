import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase-client";
import { ref, get } from "firebase/database";

type Question = {
    categoryId?: string;
    examType?: string;
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // read query param ?exam=mixed
        const { searchParams } = new URL(request.url);
        const examType = searchParams.get("exam");

        const snapshot = await get(ref(rtdb, "data/questions"));

        if (!snapshot.exists()) {
            return NextResponse.json(
                { error: "No exams found" },
                { status: 404 }
            );
        }

        const data = snapshot.val();

        // return NextResponse.json({data: data})

        // convert object → array (important for Firebase RTDB)
        const examsArray = Object.values(data as Record<string, Question>);

        // filter by category
        let filtered = examsArray.filter(
            (exam) => exam.categoryId === id
        );

        // optional filter by exam type from query
        if (examType) {
            filtered = filtered.filter(
                (exam) => exam.examType === examType
            );
        }
        return NextResponse.json({
            id,
            examType,
            count: filtered.length,
            data: filtered
        });
    } catch (error) {
        console.error("Error fetching exams:", error);

        return NextResponse.json(
            { error: "Failed to fetch exams" },
            { status: 500 }
        );
    }
}
