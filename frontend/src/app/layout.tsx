import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CommandMenu from "@/components/ui/CommandMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digvijay Singh",
  description: "Full-stack developer portfolio of Digvijay Singh. Showcasing projects, skills, and experience in web development.",
};

import { fetchContent } from "@/lib/fetchData";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let customCursorEnabled = true;
  try {
    const settings = await fetchContent('site-settings');
    if (settings && settings.length > 0) {
      customCursorEnabled = settings[0].customCursorEnabled ?? true;
    }
  } catch (e) {
    // defaults to true
  }

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers customCursorEnabled={customCursorEnabled}>
          {children}
          <CommandMenu />
        </Providers>
      </body>
    </html>
  );
}
