import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "gecjcr03",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const sanityWriteClient = createClient({
  projectId: "gecjcr03",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SiteTexts {
  aktiv?: boolean;
  topTenPublished?: boolean;
  topTenTitle?: string;
  topTenTitleLine2?: string;
  topTenDescription?: string;
  searchPlaceholder?: string;
  noResults?: string;
  loadMore?: string;
  metricBeteiligung?: string;
  metricTeams?: string;
  metricDistanz?: string;
  metricKmProMa?: string;
  metricBetriebsgroesse?: string;
  sizeAlle?: string;
  sizeMehr5000?: string;
  sizeBis5000?: string;
  sizeBis1000?: string;
  sizeBis500?: string;
  sizeBis200?: string;
  unitMa?: string;
  unitTeams?: string;
  unitPercent?: string;
  unitKm?: string;
  unitCo2?: string;
  distanzKmTotal?: string;
  distanzZiel?: string;
  distanzZumZiel?: string;
  distanzUmDieWelt?: string;
  noDataText?: string;
  loadingText?: string;
  unavailableText?: string;
  backToHome?: string;
  error404Text?: string;
  error404Link?: string;
  error500Text?: string;
  error500Button?: string;
}

export interface NavigationSettings {
  faviconUrl?: string;
  headerLogoUrl?: string;
  headerLogoLink?: string;
  navTopTen?: string;
  navFacts?: string;
  navMaps?: string;
}

export interface SiteSettings {
  socialLinks?: Array<{
    platform: string;
    url: string;
    iconUrl?: string;
  }>;
  actionByLogoUrl?: string;
  actionByUrl?: string;
  supporters?: Array<{
    name: string;
    logoUrl?: string;
    url?: string;
  }>;
}

export interface FooterTexts {
  menuItems?: Array<{
    label: string;
    url: string;
  }>;
  actionByLabel?: string;
  supportedByLabel?: string;
  copyrightText?: string;
  termsLabel?: string;
  termsUrl?: string;
  privacyLabel?: string;
  privacyUrl?: string;
}

/* ------------------------------------------------------------------ */
/*  Query functions                                                    */
/* ------------------------------------------------------------------ */

export async function getSiteTexts(sprache: string): Promise<SiteTexts> {
  const result = await sanityClient.fetch(
    `*[_type == "siteTexts" && !(_id in path("drafts.**")) && sprache == $sprache][0] {
      aktiv,
      topTenPublished,
      topTenTitle, topTenTitleLine2, topTenDescription,
      searchPlaceholder, noResults, loadMore,
      metricBeteiligung, metricTeams, metricDistanz, metricKmProMa, metricBetriebsgroesse,
      sizeAlle, sizeMehr5000, sizeBis5000, sizeBis1000, sizeBis500, sizeBis200,
      unitMa, unitTeams, unitPercent, unitKm, unitCo2,
      distanzKmTotal, distanzZiel, distanzZumZiel, distanzUmDieWelt,
      noDataText, loadingText, unavailableText, backToHome,
      error404Text, error404Link, error500Text, error500Button
    }`,
    { sprache }
  );
  return result || {};
}

export async function getNavigationSettings(sprache: string = "de"): Promise<NavigationSettings> {
  const suffix = sprache.charAt(0).toUpperCase() + sprache.slice(1);
  const result = await sanityClient.fetch(
    `*[_type == "navigationSettings" && !(_id in path("drafts.**"))][0] {
      "faviconUrl": favicon.asset->url,
      "headerLogoUrl": headerLogo.asset->url,
      "headerLogoLink": headerLogoUrl,
      "navTopTen": navTopTen${suffix},
      "navFacts": navFacts${suffix},
      "navMaps": navMaps${suffix}
    }`
  );
  return result || {};
}

export async function getActiveLanguages(): Promise<string[]> {
  const result = await sanityClient.fetch(
    `*[_type == "siteTexts" && !(_id in path("drafts.**")) && aktiv == true].sprache`
  );
  return result && result.length > 0 ? result : ["de", "fr", "it", "en"];
}

export async function getFooterSettings(): Promise<SiteSettings> {
  const result = await sanityClient.fetch(
    `*[_type == "footerSettings" && !(_id in path("drafts.**"))][0] {
      "socialLinks": socialLinks[] {
        platform,
        url,
        "iconUrl": icon.asset->url
      },
      "actionByLogoUrl": actionByLogo.asset->url,
      actionByUrl,
      "supporters": supporters[] {
        name,
        "logoUrl": logo.asset->url,
        url
      }
    }`
  );
  return result || {};
}

export async function getPageMeta(
  type: "siteTexts" | "factsPage" | "mapsPage",
  sprache: string
): Promise<{ metaTitle?: string; metaDescription?: string }> {
  const result = await sanityClient.fetch(
    `*[_type == $type && !(_id in path("drafts.**")) && sprache == $sprache][0]{ metaTitle, metaDescription }`,
    { type, sprache }
  );
  return result || {};
}

export async function getFooterTexts(sprache: string): Promise<FooterTexts> {
  const result = await sanityClient.fetch(
    `*[_type == "footerTexts" && !(_id in path("drafts.**")) && sprache == $sprache][0] {
      menuItems[] { label, url },
      actionByLabel,
      supportedByLabel,
      copyrightText,
      termsLabel, termsUrl,
      privacyLabel, privacyUrl
    }`,
    { sprache }
  );
  return result || {};
}
