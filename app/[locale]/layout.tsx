import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";

const BASE_URL = "https://stats.biketowork.ch";

const localeMeta: Record<string, { title: string; description: string; ogLocale: string }> = {
  fr: {
    title: "bike to work – Challenge 2026 Stats",
    description: "Top 10 entreprises du Challenge bike to work 2026",
    ogLocale: "fr_CH",
  },
  it: {
    title: "bike to work – Challenge 2026 Stats",
    description: "Top 10 aziende della Challenge bike to work 2026",
    ogLocale: "it_CH",
  },
  en: {
    title: "bike to work – Challenge 2026 Stats",
    description: "Top 10 companies of the bike to work Challenge 2026",
    ogLocale: "en",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = localeMeta[locale] || localeMeta.en;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = l === "de" ? BASE_URL : `${BASE_URL}/${l}`;
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}/${locale}`,
      siteName: "bike to work Stats",
      locale: meta.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages,
    },
  };
}

export function generateStaticParams() {
  return locales
    .filter((l) => l !== "de")
    .map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
