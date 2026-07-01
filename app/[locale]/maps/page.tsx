import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapsContent } from "@/components/MapsContent";
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
  const meta = await getPageMeta("mapsPage", locale);
  const title = meta.metaTitle || "Maps | bike to work Challenge 2026";
  const description = meta.metaDescription || "";

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = l === "de" ? `${BASE_URL}/maps` : `${BASE_URL}/${l}/maps`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/maps`,
      siteName: "bike to work Stats",
      locale: ogLocales[locale] || "en",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${BASE_URL}/${locale}/maps`, languages },
  };
}

export default async function LocaleMapsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale) || locale === defaultLocale) {
    notFound();
  }

  return <MapsContent locale={locale as Locale} />;
}
