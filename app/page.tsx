import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import { Button } from "@/components/ui/Button";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          TreamExam
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/user/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          The Future of Online Examinations
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          Simplify Your Testing <br /> Experience with TreamExam
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          A modern, secure, and intuitive platform designed for students and educators. 
          Manage exams, track progress, and achieve excellence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          {user ? (
            <Link href="/user/dashboard">
              <Button size="lg" className="px-10 h-14 text-lg shadow-xl shadow-primary/20">
                Continue to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/register">
                <Button size="lg" className="px-10 h-14 text-lg shadow-xl shadow-primary/20">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="px-10 h-14 text-lg border-slate-800 hover:bg-slate-900">
                  View Demo
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 w-full max-w-5xl animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm text-left hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Ultra Secure</h3>
            <p className="text-slate-400 leading-relaxed">
              Enterprise-grade security with role-based access control and encrypted data storage.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm text-left hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Insights</h3>
            <p className="text-slate-400 leading-relaxed">
              Get instant feedback and detailed analytics on examination performance and system health.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm text-left hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Modern Layout</h3>
            <p className="text-slate-400 leading-relaxed">
              A clean, responsive sidebar dashboard designed for maximum productivity across all devices.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">
            © 2026 TreamExam. Developed by Morm Leapsovann.
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
