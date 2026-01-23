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
  description:
    "Your personal AI travel guide. Real-time safety insights, immersive audio advisories, and smart budget predictions.",
  applicationName: "Travellum",
  authors: [{ name: "Istiyaq Khan Razin" }],
  creator: "Istiyaq Khan Razin",
  publisher: "Istiyaq Khan Razin",
  keywords: [
    "AI Travel",
    "Travel Safety",
    "Budget Travel",
    "Smart Travel Guide",
    "Travellum",
    "Trip Planner",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://travellum.vercel.app"
  ),
  openGraph: {
    title: "Travellum | AI Travel Intelligence",
    description:
      "Your personal AI travel guide. Real-time safety insights, immersive audio advisories, and smart budget predictions.",
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
  verification: {
    google: "r7320kg3zhgfCc-dBs17Z5HYl2vblzN0-f5aIWVVp7M",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travellum | AI Travel Intelligence",
    description:
      "Your personal AI travel guide. Real-time safety insights, immersive audio advisories, and smart budget predictions.",
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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Istiyaq Khan Razin",
  jobTitle: "Founder & Automation Engineer",
  url: "https://istiyaq.vercel.app/about",
  sameAs: [
    "https://github.com/Istiyaq-Khan",
    "https://www.linkedin.com/in/istiyaq-khan",
    "https://www.instagram.com/ist.iyaqkhan",
    "https://www.youtube.com/@istiyaq-khan10",
    "https://x.com/istiyaqkhanr",
    "https://istiyaq.vercel.app"'
  ],
  knowsAbout: [
    "Video Editing",
    "Motion Graphics",
    "Python",
    "n8n",
    "Automation",
    "YouTube Growth",
  ],
  description:
    "A Sylhet-based professional positioning himself at the intersection of creative media and technical automation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
