"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `
Hello, my name is ${formData.name}.
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
    `.trim();

    const encodedText = encodeURIComponent(text);
    const telegramUrl = `https://t.me/mormleapsovann?text=${encodedText}`;

    // Open Telegram in a new tab
    window.open(telegramUrl, "_blank");

    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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

      <div className="max-w-6xl mx-auto px-6 pt-16 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Fill out the form below or use our contact details.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary">Get in Touch</h2>
              <p className="text-slate-300 leading-relaxed">
                Whether you're an educator, a student, or just interested in our platform, our team is here to help you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-slate-400">mormleapsovann@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Office</p>
                  <p className="text-slate-400">Rotanakmondol, Battambang, Cambodia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Phone</p>
                  <p className="text-slate-400">+855 16 677 462</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-900">
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a 
                  href="https://www.linkedin.com/in/morm-leapsovann-b531b7301?originalSubdomain=kh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm hover:border-primary transition-all"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/codeshark-lucifer/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm hover:border-primary transition-all"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Message Sent!</h3>
                  <p className="text-slate-400">Thank you for reaching out. Our team will contact you shortly.</p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Name</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Email</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Subject</label>
                    <input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
