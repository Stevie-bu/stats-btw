"use client";

import { useParams, notFound } from "next/navigation";
import { FactsContent } from "@/components/FactsContent";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export default function LocaleFactsPage() {
  const params = useParams();
  const locale = params.locale as string;

  if (!locales.includes(locale as Locale) || locale === defaultLocale) {
    notFound();
  }

  return <FactsContent locale={locale as Locale} />;
}
