import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { adminFirestore } from "@/lib/firebase-admin";
import admin from "firebase-admin";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { categoryId, examTypeId, score, answers } = await req.json();

        // Save result to Firestore
        const resultRef = adminFirestore.collection("results").doc();
        const resultData = {
            userId: user.uid,
            categoryId,
            examTypeId,
            score,
            answers, // contains questionId, selected, correct, isCorrect
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };
        await resultRef.set(resultData);

        // Update user's aggregate stats and calculate streak
        const userRef = adminFirestore.collection("users").doc(user.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data() || {};
        
        let newStreak = userData.streak || 0;
        const lastExamAt = userData.lastExamAt;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        
        if (!lastExamAt) {
            newStreak = 1;
        } else {
            const lastDate = lastExamAt.toDate();
            const lastExamDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            
            if (today === lastExamDay + oneDay) {
                // Was yesterday, increment
                newStreak += 1;
            } else if (today > lastExamDay + oneDay) {
                // Was more than one day ago, reset
                newStreak = 1;
            } else if (today === lastExamDay) {
                // Was already today, keep the same streak
                newStreak = userData.streak || 1;
            }
        }

        await userRef.set({
            totalExams: admin.firestore.FieldValue.increment(1),
            totalScore: admin.firestore.FieldValue.increment(score),
            lastExamAt: admin.firestore.FieldValue.serverTimestamp(),
            streak: newStreak,
        }, { merge: true });

        // Recalculate rank (Simple version: based on totalScore / totalExams)
        // In a real app, this might be a background job or a more complex query
        
        return NextResponse.json({ success: true, resultId: resultRef.id });
    } catch (error: any) {
        console.error("Exam submission error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
