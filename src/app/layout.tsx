import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Josefin_Sans } from "next/font/google";
import Script from "next/script";
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-THHVTYM0J2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-THHVTYM0J2');
            gtag('config', 'GT-MQB863T5');
          `}
        </Script>
      </head>
      <body className={`${josefinSans.variable} font-sans antialiased overflow-x-hidden w-full`} style={{ backgroundColor: "#ffffff", color: "#1f1f1f" }} suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="min-h-screen pt-24 overflow-x-hidden w-full flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
