import { notFound } from "next/navigation";
import { TopTenContent } from "@/components/TopTenContent";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export const revalidate = 300;

export default async function LocaleTopTenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale) || locale === defaultLocale) {
    notFound();
  }

  return <TopTenContent locale={locale as Locale} />;
}
