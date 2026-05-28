import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase-client";

import { ref, get } from "firebase/database";

export async function GET() {
  try {
    const snapshot = await get(ref(rtdb, "data/categories"));

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "No categories found" },
        { status: 404 }
      );
    }

    const categories = snapshot.val();

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}