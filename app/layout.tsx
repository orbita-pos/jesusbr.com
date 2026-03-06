import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

const siteUrl = "https://jesusbr.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Jesus Bernal — Fundador de Orbita POS",
  description:
    "Solo founder construyendo Orbita POS: punto de venta con vision AI, offline mode y facturacion electronica para tienditas y PyMEs en Mexico. Next.js, TypeScript, PostgreSQL.",
  keywords: [
    "Orbita POS",
    "punto de venta",
    "punto de venta Mexico",
    "POS Mexico",
    "sistema punto de venta",
    "software tiendita",
    "retail software Mexico",
    "Jesus Bernal",
    "solo founder",
    "visual product recognition",
    "facturacion electronica CFDI",
  ],
  verification: {
    google: "zkRhEiduDZJFScY4dYbNxrr1kwnPymSd3V_nxZFJViU",
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Jesus Bernal — Fundador de Orbita POS",
    description:
      "Solo founder. Sistema de punto de venta completo para tienditas y PyMEs en Mexico. Codigo, diseno e infra, una sola persona.",
    type: "website",
    url: siteUrl,
    siteName: "Jesus Bernal",
    locale: "es_MX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jesus Bernal — Fundador de Orbita POS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Bernal — Fundador de Orbita POS",
    description:
      "Solo founder. Sistema de punto de venta con vision AI para tienditas y PyMEs en Mexico.",
    images: ["/og-image.png"],
    creator: "@OrbitaPOS",
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

export const viewport: Viewport = {
  themeColor: "#1a1d2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
      <Analytics />
    </html>
  );
}
