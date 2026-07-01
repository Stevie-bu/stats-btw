import { locales } from "@/lib/i18n";

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
