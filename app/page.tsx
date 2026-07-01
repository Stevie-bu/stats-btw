import type { Metadata } from "next";
import { TopTenContent } from "@/components/TopTenContent";
import { getPageMeta } from "@/lib/sanity";
import { locales } from "@/lib/i18n";

const BASE_URL = "https://stats.biketowork.ch";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("siteTexts", "de");
  const title = meta.metaTitle || "Top 10 Betriebe | bike to work Challenge 2026";
  const description = meta.metaDescription || "Top 10 Betriebe der bike to work Challenge 2026";

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = l === "de" ? BASE_URL : `${BASE_URL}/${l}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: "bike to work Stats",
      locale: "de_CH",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: BASE_URL, languages },
  };
}

export default function TopTenPage() {
  return <TopTenContent locale="de" />;
}
