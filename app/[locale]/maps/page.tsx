"use client";

import { useParams, notFound } from "next/navigation";
import { MapsContent } from "@/components/MapsContent";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export default function LocaleMapsPage() {
  const params = useParams();
  const locale = params.locale as string;

  if (!locales.includes(locale as Locale) || locale === defaultLocale) {
    notFound();
  }

  return <MapsContent locale={locale as Locale} />;
}
