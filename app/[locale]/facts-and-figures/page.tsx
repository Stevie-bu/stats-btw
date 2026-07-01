import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FactsContent } from "@/components/FactsContent";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";
import { getPageMeta } from "@/lib/sanity";

const BASE_URL = "https://stats.biketowork.ch";
const ogLocales: Record<string, string> = { fr: "fr_CH", it: "it_CH", en: "en" };

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getPageMeta("factsPage", locale);
  const title = meta.metaTitle || "Facts & Figures | bike to work Challenge 2026";
  const description = meta.metaDescription || "";

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = l === "de" ? `${BASE_URL}/facts-and-figures` : `${BASE_URL}/${l}/facts-and-figures`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/facts-and-figures`,
      siteName: "bike to work Stats",
      locale: ogLocales[locale] || "en",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${BASE_URL}/${locale}/facts-and-figures`, languages },
  };
}

export default async function LocaleFactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale) || locale === defaultLocale) {
    notFound();
  }

  return <FactsContent locale={locale as Locale} />;
}
