import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fbfcfb",
};

export const metadata = {
  title: "Varity — AI-Powered Video Editing Platform",
  description:
    "Edit videos at the speed of creativity. Varity is a modern professional AI-powered video editing platform engineered featuring cinematic effects, smart cuts, auto captions, and fluid timeline editing for creators.",
  keywords: [
    "video editing",
    "AI video editor",
    "cinematic effects",
    "content creation",
    "social media tools",
    "varity editor",
    "professional video software"
  ],
  authors: [{ name: "Varity" }],
  creator: "Varity",
  publisher: "Varity Inc.",
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
  alternates: {
    canonical: "https://varity.com",
  },
  openGraph: {
    title: "Varity — AI-Powered Video Editing Platform",
    description: "Edit videos at the speed of creativity. Experience flawless cinematic AI editing.",
    url: "https://varity.com",
    siteName: "Varity",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Varity — AI-Powered Video Editing",
    description: "Edit videos at the speed of creativity. Experience flawless cinematic AI editing.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-[#1a1a2e] antialiased">
        {children}
        {/* Subtle dot pattern overlay */}
        <div className="dot-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
