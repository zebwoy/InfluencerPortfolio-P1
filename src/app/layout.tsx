import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeya • UGC in Skin & Hair Care",
  description:
    "Micro-level UGC creator sharing authentic skin and Hair Care tips. Minimal, airy portfolio with contact links.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Nav />
        <main className="mx-auto max-w-5xl px-6 sm:px-8 pt-16 pb-28">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
