import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virtual Queue Management System | VQMS",
  description:
    "Virtual Queue Management System (VQMS) is a powerful tool designed to streamline queue management for businesses, enhancing customer experience and operational efficiency.",
  keywords: [
    "queue management",
    "virtual queue",
    "VQMS",
    "business tools",
    "customer service",
    "queue system",
    "real-time updates",
    "remote check-in",
  ],
  authors: [{ name: "Amit", url: "https://beamitpal.com" }],
  creator: "Amit",
  publisher: "IGNOU BCA Project",

  openGraph: {
    title: "Virtual Queue Management System | VQMS",
    description:
      "Streamline your business with VQMS, a virtual queue management system offering real-time updates and remote check-in for improved customer satisfaction.",
    url: "https://vqms.beamitpal.com",
    siteName: "VQMS",
    images: [
      {
        url: "https://vqms.beamitpal.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VQMS - Virtual Queue Management System",
      },
    ],
    locale: "en_US",
    type: "website",
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
  alternates: {
    canonical: "https://vqms.beamitpal.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window !== "undefined") {
    import("../mocks/browser").then(({ worker }) => worker.start());
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
