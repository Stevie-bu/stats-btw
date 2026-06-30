import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import { sanityClient } from "@/lib/sanity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const brandonGrotesque = localFont({
  src: "../public/fonts/brandon-grotesque-black-italic.otf",
  weight: "900",
  style: "italic",
  variable: "--font-display",
  display: "swap",
});

const BASE_URL = "https://stats.biketowork.ch";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "bike to work – Challenge 2026 Stats",
  description: "Top 10 Betriebe der bike to work Challenge 2026",
  openGraph: {
    title: "bike to work – Challenge 2026 Stats",
    description: "Top 10 Betriebe der bike to work Challenge 2026",
    url: BASE_URL,
    siteName: "bike to work Stats",
    locale: "de_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bike to work – Challenge 2026 Stats",
    description: "Top 10 Betriebe der bike to work Challenge 2026",
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      de: BASE_URL,
      fr: `${BASE_URL}/fr`,
      it: `${BASE_URL}/it`,
      en: `${BASE_URL}/en`,
    },
  },
  other: {
    "theme-color": "#fa7fdf",
  },
};

export const revalidate = 300;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await sanityClient.fetch<{ headCode?: string } | null>(
    `*[_type == "navigationSettings" && !(_id in path("drafts.**"))][0]{ headCode }`
  );

  return (
    <html lang="de" className={`${inter.variable} ${brandonGrotesque.variable}`}>
      {settings?.headCode && (
        <head>
          <script dangerouslySetInnerHTML={{ __html: settings.headCode }} />
        </head>
      )}
      <body className="font-[family-name:var(--font-body)] antialiased">
        {children}
        <AgentationProvider />
      </body>
    </html>
  );
}
