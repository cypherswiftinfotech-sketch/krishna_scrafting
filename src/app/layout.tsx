import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const cinzel = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-heading" });
const outfit = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Sri Krishna Crafting",
  description:
    "Premium custom crafting, exquisite details, and timeless design.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${cinzel.variable} font-sans antialiased`} style={{ backgroundColor: "#ffffff", color: "#1f1f1f" }}>
        <Providers>
          <Header />
          <main className="min-h-screen pt-24">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
