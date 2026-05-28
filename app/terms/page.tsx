import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      <nav className="border-b border-slate-900 px-6 py-6 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            TreamExam
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Back to Home</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-slate-400">Last updated: May 28, 2026</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing or using TreamExam, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use the platform.
            </p>
          </section>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-xl">2. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>To use certain features of the platform, you must register for an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information.</li>
                <li>Maintain the security of your password and identification.</li>
                <li>Be fully responsible for all use of your account and for any actions that take place using your account.</li>
              </ul>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">3. Intellectual Property</h2>
            <p className="text-slate-300 leading-relaxed">
              All content on TreamExam, including text, graphics, logos, and software, is the property of TreamExam or its content suppliers and is protected by international copyright laws.
            </p>
          </section>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-xl">4. Prohibited Conduct</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>You agree not to use the platform for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the platform in any way that could damage the platform or general business of TreamExam.</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Harass, abuse, or threaten others or otherwise violate any person's legal rights.</li>
                <li>Violate any intellectual property rights of TreamExam or any third party.</li>
                <li>Upload or otherwise disseminate any computer viruses or other software that may damage the property of another.</li>
                <li>Engage in any fraudulent activity.</li>
              </ul>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">5. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              TreamExam shall not be liable for any damages that may occur to you as a result of your use of our platform, to the fullest extent permitted by law.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-900">
            <h2 className="text-2xl font-bold text-primary">6. Changes to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to modify these terms at any time. We will do so by posting the updated terms on this site. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
