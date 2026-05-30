import type { Metadata } from "next";
import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy-pro",
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TreamExam - Modern Examination Platform",
  description: "A professional and modern platform for examinations and user management.",
};

import { TranslationProvider } from "@/lib/translate";
import { ThemeProvider } from "@/lib/theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="km"
      className={`${kantumruyPro.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans selection:bg-primary/30">
        <ThemeProvider>
          <TranslationProvider>
            {children}
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

