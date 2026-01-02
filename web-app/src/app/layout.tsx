import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App - Phase II",
  description: "Evolution of Todo - Full Stack Web Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
              {children}
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
