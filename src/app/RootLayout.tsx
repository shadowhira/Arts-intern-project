// src/app/RootLayout.tsx
"use client";

import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./components/NavBar";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavBar = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!hideNavBar && <NavBar />}
        <main className="max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}