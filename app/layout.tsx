import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Providers from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaero-prescribe.kaerogroup.com/"),
  title: "KaeroPrescribe – AI Operating System for Modern Healthcare",
  description:
    "Modular pharmacy and hospital management platform with AI-native intelligence, built for Indian regulations with global readiness.",
  keywords: [
    "healthcare",
    "hospital management",
    "pharmacy management",
    "AI healthcare",
    "regulated healthcare software",
  ],
  openGraph: {
    title: "KaeroPrescribe – AI Operating System for Modern Healthcare",
    description:
      "Modular pharmacy and hospital management platform with AI-native intelligence.",
    type: "website",
    url: "https://kaero-prescribe.kaerogroup.com/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "KaeroPrescribe Healthcare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KaeroPrescribe – AI Operating System for Modern Healthcare",
    description:
      "Modular pharmacy and hospital management platform with AI-native intelligence.",
    images: [
      "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=1200&h=630&fit=crop",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${dmSans.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body className={dmSans.className}>
        <Providers>
          {children}
          <Toaster />
          <Sonner position="top-right" expand={true} richColors />
        </Providers>
      </body>
    </html>
  );
}
