import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Simple Nav */}
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
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: May 28, 2026</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              Welcome to TreamExam. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our 
              website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-xl">2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> includes first name, last name, and display name.</li>
                <li><strong>Contact Data:</strong> includes email address.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                <li><strong>Profile Data:</strong> includes your username, password, exam results, and preferences.</li>
              </ul>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">3. How We Use Your Information</h2>
            <p className="text-slate-300 leading-relaxed">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>To register you as a new user.</li>
              <li>To provide and manage your account.</li>
              <li>To manage our relationship with you.</li>
              <li>To enable you to partake in examinations and track your progress.</li>
              <li>To improve our website, products/services, marketing, or customer relationships.</li>
            </ul>
          </section>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-xl">4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. 
                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. 
                We use Firebase's secure authentication and Google Cloud's infrastructure to ensure your data is protected with industry-standard encryption.
              </p>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">5. Your Rights</h2>
            <p className="text-slate-300 leading-relaxed">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-900">
            <h2 className="text-2xl font-bold text-primary">6. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <p className="font-bold text-white">Morm Leapsovann</p>
              <p className="text-slate-400">Email: mormleapsovann@gmail.com</p>
              <p className="text-slate-400">Location: Rotanakmondol, Battambang, Cambodia</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
