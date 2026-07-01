import type { Metadata } from "next";
import { MapsContent } from "@/components/MapsContent";
import { getPageMeta } from "@/lib/sanity";
import { locales } from "@/lib/i18n";

const BASE_URL = "https://stats.biketowork.ch";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("mapsPage", "de");
  const title = meta.metaTitle || "Karten | bike to work Challenge 2026";
  const description = meta.metaDescription || "Kartenansichten der bike to work Challenge 2026";

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
      url: `${BASE_URL}/maps`,
      siteName: "bike to work Stats",
      locale: "de_CH",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${BASE_URL}/maps`, languages },
  };
}

export default function MapsPage() {
  return <MapsContent locale="de" />;
}
