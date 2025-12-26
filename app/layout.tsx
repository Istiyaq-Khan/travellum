import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Travellum | AI Travel Intelligence",
    template: "%s | Travellum",
  },
  description: "Your personal AI travel guide. Real-time safety insights, immersive audio advisories, and smart budget predictions.",
  applicationName: "Travellum",
  authors: [{ name: "Istiyaq Khan Razin" }],
  keywords: ["Travel", "AI", "Safety", "Budget", "Guide", "Travellum", "Trip Planner", "Smart Travel"],
  creator: "Istiyaq Khan Razin",
  publisher: "Istiyaq Khan Razin",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://travellum.vercel.app"),
  openGraph: {
    title: "Travellum | AI Travel Intelligence",
    description: "Your personal AI travel guide. Real-time safety insights, immersive audio advisories, and smart budget predictions.",
    url: "https://travellum.vercel.app",
    siteName: "Travellum",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 600,
        alt: "Travellum Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travellum | AI Travel Intelligence",
    description: "Your personal AI travel guide. Real-time safety insights, immersive audio advisories, and smart budget predictions.",
    images: ["/icon.png"],
    creator: "@istiyaqkhanr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
