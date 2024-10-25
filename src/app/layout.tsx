import React from "react";
import type { Metadata } from "next";
import RootLayout from "./RootLayout";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Image Gallery",
  description: "Mom",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayout>{children}</RootLayout>;
}