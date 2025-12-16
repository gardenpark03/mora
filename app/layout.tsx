import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Mora - Your meeting memory, visualized",
    template: "%s | Mora"
  },
  description: "AI-powered meeting workspace that listens, summarizes, and visualizes your meetings in real-time. Never lose track of important discussions again.",
  keywords: [
    "AI meeting",
    "meeting transcription", 
    "meeting summary",
    "meeting visualization",
    "team collaboration",
    "AI workspace",
    "meeting assistant",
    "GPT meeting",
    "Whisper transcription"
  ],
  authors: [{ name: "Mora Team" }],
  creator: "Mora",
  publisher: "Mora",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR", "ja_JP", "es_ES"],
    url: "https://mora.app",
    title: "Mora - Your meeting memory, visualized",
    description: "AI that listens, summarizes, and draws your meeting in real time.",
    siteName: "Mora",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mora - AI Meeting Workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mora - Your meeting memory, visualized", 
    description: "AI that listens, summarizes, and draws your meeting in real time.",
    images: ["/og-image.png"],
    creator: "@moraapp",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://mora.app",
    languages: {
      en: "https://mora.app/en",
      ko: "https://mora.app/ko", 
      ja: "https://mora.app/ja",
      es: "https://mora.app/es",
    },
  },
}

// This is the root layout - it should only handle non-locale routes
// The [locale] layout will handle internationalized routes
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}