import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SwrProvider } from "@/lib/swr/provider";

const shurikenDisplay = Orbitron({
  variable: "--font-shuriken-display",
  subsets: ["latin"],
});

const shurikenBody = Space_Grotesk({
  variable: "--font-shuriken-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shuriken - Production-Ready Starter Template",
  description: "Discover events, scholarships, jobs, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${shurikenDisplay.variable} ${shurikenBody.variable} antialiased`}
      >
        <SwrProvider>
          <Navbar />
          {children}
        </SwrProvider>
      </body>
    </html>
  );
}
