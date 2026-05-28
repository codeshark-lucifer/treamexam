import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase-client";

import { ref, get } from "firebase/database";

type Category = {
    id?: string;
    _id?: string;
};

function toArray<T>(value: T[] | Record<string, T>) {
    return Array.isArray(value) ? value : Object.values(value);
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json(
            { error: "Category ID is required" },
            { status: 400 }
        );
    }

    try {

        const snapshot = await get(ref(rtdb, "data/categories"));

        if (!snapshot.exists()) {
            return NextResponse.json(
                { error: "No categories found" },
                { status: 404 }
            );
        }

        const categories = toArray(snapshot.val() as Category[] | Record<string, Category>);
        const category = categories.map((cat) => ({
            ...cat,
            id: cat.id || cat._id || null,
        })).find((cat) => cat.id === id);

        return NextResponse.json({
            data: category || null,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);

        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
