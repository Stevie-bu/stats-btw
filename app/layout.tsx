import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
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

  const scripts: Array<{ src?: string; content?: string }> = [];
  if (settings?.headCode) {
    const srcMatches = settings.headCode.matchAll(
      /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi
    );
    for (const m of srcMatches) {
      scripts.push({ src: m[1] });
    }
    const inlineMatches = settings.headCode.matchAll(
      /<script\b[^>]*>([^<]+)<\/script>/gi
    );
    for (const m of inlineMatches) {
      if (!m[0].includes("src=")) {
        scripts.push({ content: m[1].trim() });
      }
    }
  }

  return (
    <html lang="de" className={`${inter.variable} ${brandonGrotesque.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased">
        {children}
        <AgentationProvider />
        {scripts.map((s, i) =>
          s.src ? (
            <Script key={i} src={s.src} strategy="afterInteractive" />
          ) : (
            <Script key={i} id={`head-code-${i}`} strategy="afterInteractive">
              {s.content}
            </Script>
          )
        )}
      </body>
    </html>
  );
}
