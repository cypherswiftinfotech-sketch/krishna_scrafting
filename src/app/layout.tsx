import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sri Krishna Crafting",
  description:
    "Premium custom crafting, exquisite details, and timeless design.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${josefinSans.variable} font-sans antialiased`} style={{ backgroundColor: "#ffffff", color: "#1f1f1f" }} suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="min-h-screen pt-24">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
