import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/common/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://eczanebul.co"),
  title: "Nöbetçi Eczane — Bugün Nöbetçi Eczaneler",
  description:
    "Türkiye genelinde bugün nöbetçi eczaneleri harita üzerinde bulun, yol tarifi alın. 81 ilde güncel listeye anında ulaşın.",
  alternates: {
    canonical: "https://eczanebul.co",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'apple-touch-icon-precomposed', url: '/apple-icon-precomposed.png' }
    ]
  },
  openGraph: {
    title: "Nöbetçi Eczane — Bugün Nöbetçi Eczaneler",
    description: "Türkiye genelinde bugün nöbetçi eczaneleri harita üzerinde bulun.",
    url: "https://eczanebul.co",
    siteName: "Nöbetçi Eczane",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: "tr_TR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
