import { notFound } from "next/navigation";
import { FactsContent } from "@/components/FactsContent";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export const revalidate = 300;

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
