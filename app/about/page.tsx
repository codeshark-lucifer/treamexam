import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Simple Nav */}
      <nav className="border-b border-slate-900 px-6 py-6 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            <Image src="/images/logo1.png" alt="Logo" width={32} height={32} />
            TreamExam
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Back to Home</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About TreamExam</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A high-performance, modern online examination and assessment platform designed for ministry and state institution entrance exam preparation.
          </p>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              TreamExam was created to bridge the gap between education and employment by providing a high-quality, accessible testing platform for civil servant candidates. Our mission is to empower students with the tools they need to succeed in their career journeys within public service.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <i className="fa-solid fa-bolt text-yellow-500"></i>
                  Fast & Reliable
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Built with Next.js and Firebase Realtime Database to ensure instant loading of exam content and smooth transitions during assessments.
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-primary"></i>
                  Secure Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Enterprise-grade security using Firebase Admin SDK and custom role-based access control to protect exam integrity and user data.
              </CardContent>
            </Card>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Key Modules</h2>
            <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl border border-slate-900 bg-slate-900/30">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl">
                        <i className="fa-solid fa-gauge-high"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Intelligent Dashboards</h3>
                        <p className="text-slate-400 text-sm">Personalized dashboards for students to track progress, and a comprehensive control center for administrators to manage the system.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl border border-slate-900 bg-slate-900/30">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-xl">
                        <i className="fa-solid fa-layer-group"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Diverse Exam Catalog</h3>
                        <p className="text-slate-400 text-sm">A vast collection of questions organized by ministries, covering education, health, interior, and more.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl border border-slate-900 bg-slate-900/30">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 text-xl">
                        <i className="fa-solid fa-chart-line"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Advanced Analytics</h3>
                        <p className="text-slate-400 text-sm">Real-time performance tracking with detailed breakdowns of scores, streaks, and areas for improvement.</p>
                    </div>
                </div>
            </div>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-900">
            <h2 className="text-2xl font-bold text-primary">Technology Behind TreamExam</h2>
            <p className="text-slate-300 leading-relaxed">
                We leverage the latest web technologies to deliver a world-class experience:
            </p>
            <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium">Next.js 16</span>
                <span className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium">TypeScript</span>
                <span className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium">Tailwind CSS</span>
                <span className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium">Firebase Auth</span>
                <span className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium">Cloud Firestore</span>
                <span className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium">Realtime Database</span>
            </div>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-900">
            <h2 className="text-2xl font-bold text-primary">Contact the Developer</h2>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="font-bold text-xl text-white">Morm Leapsovann</p>
                <p className="text-slate-400 text-sm">Full-Stack Developer | Cambodia</p>
              </div>
              <div className="flex gap-3">
                <Link href="/contact">
                    <Button>Get in Touch</Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
