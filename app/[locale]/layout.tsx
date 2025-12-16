import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import "../globals.css"
import Navbar from "@/components/Navbar"
import { locales } from '@/i18n'

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

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}