"use client";

import { useParams, notFound } from "next/navigation";
import { TopTenContent } from "@/components/TopTenContent";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export default function LocaleTopTenPage() {
  const params = useParams();
  const locale = params.locale as string;

  if (!locales.includes(locale as Locale) || locale === defaultLocale) {
    notFound();
  }

  return <TopTenContent locale={locale as Locale} />;
}
