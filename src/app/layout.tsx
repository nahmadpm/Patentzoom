import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { LayoutChrome } from "@/components/layout-chrome";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://patentzoom.us"),
  title: {
    default: "PatentZoom | Patent Protection For Funded Startups",
    template: "%s | PatentZoom",
  },
  description:
    "A modern rebuild of PatentZoom focused on startup IP strategy, lead generation, and a cleaner client experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-white">
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
