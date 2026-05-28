import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Welcome to TreamExam
      </h1>
      
      <div className="flex gap-4">
        {user ? (
          <Link 
            href="/user/dashboard" 
            className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all font-semibold"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link 
              href="/auth/login" 
              className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all font-semibold"
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="px-8 py-3 rounded-full border border-slate-700 hover:bg-slate-800 transition-all font-semibold"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

