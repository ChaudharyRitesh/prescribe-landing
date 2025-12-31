import "./globals.css";
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

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
    <html lang="en" className={sora.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        className={`${inter.className} bg-white text-neutral-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
