import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProvider from "@/components/provider/ModalProvider";
import React from "react";
import QueryProvider from "@/components/provider/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <QueryProvider>
          <body className={inter.className}>
            {children}
            <ModalProvider />
            <Toaster />
          </body>
        </QueryProvider>
      </html>
    </ClerkProvider>
  );
}
