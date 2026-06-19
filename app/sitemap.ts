import type { MetadataRoute } from "next";

const BASE_URL = "https://stats.biketowork.ch";

const routes = ["", "/facts-and-figures", "/maps"];
const locales = ["de", "fr", "it", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] =
        locale === "de"
          ? `${BASE_URL}${route}`
          : `${BASE_URL}/${locale}${route}`;
    }

    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1 : 0.8,
      alternates: { languages },
    });

    for (const locale of locales.filter((l) => l !== "de")) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: route === "" ? 1 : 0.8,
        alternates: { languages },
      });
    }
  }

  return entries;
}
