import { notFound } from "next/navigation";
import { MapsContent } from "@/components/MapsContent";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export const revalidate = 300;

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
