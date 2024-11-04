"use client";

import React, { useEffect, useState } from "react";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./components/NavBar";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "../redux/store";

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

const hiddenNavBarPaths = [
  "/login",
  "/register",
  "/forgot-password",
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hideNavBar, setHideNavBar] = useState(false);
  const [themeTokens, setThemeTokens] = useState({
    colorPrimary: "#00b96b",
    borderRadius: 2,
    colorBgContainer: "#f6ffed",
  });

  useEffect(() => {
    setHideNavBar(hiddenNavBarPaths.includes(pathname));
  }, [pathname]);

  const handleThemeChange = (newTokens: Partial<typeof themeTokens>) => {
    setThemeTokens(prevTokens => ({
      ...prevTokens,
      ...newTokens,
    }));
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConfigProvider
          theme={{
            token: themeTokens,
          }}
        >
          <Provider store={store}>
            {!hideNavBar && <NavBar onThemeChange={handleThemeChange} />}
            <main className="max-w-6xl mx-auto">{children}</main>
          </Provider>
        </ConfigProvider>
      </body>
    </html>
  );
}
