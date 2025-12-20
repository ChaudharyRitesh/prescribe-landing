import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  metadataBase: new URL('https://kaerocare.com'),
  title: 'KaeroCare – AI Operating System for Modern Healthcare',
  description: 'Modular pharmacy and hospital management platform with AI-native intelligence, built for Indian regulations with global readiness.',
  keywords: ['healthcare', 'hospital management', 'pharmacy management', 'AI healthcare', 'regulated healthcare software'],
  openGraph: {
    title: 'KaeroCare – AI Operating System for Modern Healthcare',
    description: 'Modular pharmacy and hospital management platform with AI-native intelligence.',
    type: 'website',
    url: 'https://kaerocare.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'KaeroCare Healthcare Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KaeroCare – AI Operating System for Modern Healthcare',
    description: 'Modular pharmacy and hospital management platform with AI-native intelligence.',
    images: ['https://images.unsplash.com/photo-1576091160550-112173f7f869?w=1200&h=630&fit=crop'],
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%236B7280' font-weight='bold'>K</text></svg>" />
      </head>
      <body className={`${inter.className} bg-white text-neutral-900 antialiased`}>{children}</body>
    </html>
  );
}
