import type { Metadata } from "next";
import { FactsContent } from "@/components/FactsContent";
import { getPageMeta } from "@/lib/sanity";
import { locales } from "@/lib/i18n";

const BASE_URL = "https://stats.biketowork.ch";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("factsPage", "de");
  const title = meta.metaTitle || "Zahlen & Fakten | bike to work Challenge 2026";
  const description = meta.metaDescription || "Alle Zahlen der bike to work Challenge 2026";

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
      url: `${BASE_URL}/facts-and-figures`,
      siteName: "bike to work Stats",
      locale: "de_CH",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${BASE_URL}/facts-and-figures`, languages },
  };
}

export default function FactsPage() {
  return <FactsContent locale="de" />;
}
