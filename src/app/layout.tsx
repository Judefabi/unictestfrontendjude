import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "UNIC Test",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // with a more indepth app, we should add things like error boundaries and other UX pages to enahnce user experience with the app and custmize it to suite the brand 
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={cn(
          `min-h-screen w-full text-foreground bg-background ${inter.variable} ${spaceGrotesk.variable}`
        )}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
