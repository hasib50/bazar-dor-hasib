
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body suppressHydrationWarning>
        <Header />
        <main className="min-h-[calc(100vh-150px)]">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{ duration: 2800 }}
        />
      </body>
    </html>
  );
}
