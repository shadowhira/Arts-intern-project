"use client";

import React, { useEffect, useState } from "react";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./components/NavBar";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";

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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [hideNavBar, setHideNavBar] = useState(false);

  useEffect(() => {
    setHideNavBar(
      pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/forgot-password"
    );
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {!hideNavBar && <NavBar />}
          <main className="max-w-6xl mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
