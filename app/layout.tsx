import "./globals.css";
import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import NavBar from "@/components/NavBar";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daily Task Tracker",
  description: "Track your daily habits and tasks with your group",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-dark-bg text-white font-sora antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-[240px]">
            <NavBar />
            <div className="p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
