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
  navTopTen?: string;
  navFacts?: string;
  navMaps?: string;
  topTenTitle?: string;
  topTenTitleLine2?: string;
  topTenDescription?: string;
  searchPlaceholder?: string;
  noResults?: string;
  loadMore?: string;
  unavailableText?: string;
  backToHome?: string;
}

export interface NavigationSettings {
  faviconUrl?: string;
  headerLogoUrl?: string;
  headerLogoLink?: string;
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
      navTopTen, navFacts, navMaps,
      topTenTitle, topTenTitleLine2, topTenDescription,
      searchPlaceholder, noResults, loadMore,
      unavailableText, backToHome
    }`,
    { sprache }
  );
  return result || {};
}

export async function getNavigationSettings(): Promise<NavigationSettings> {
  const result = await sanityClient.fetch(
    `*[_type == "navigationSettings" && !(_id in path("drafts.**"))][0] {
      "faviconUrl": favicon.asset->url,
      "headerLogoUrl": headerLogo.asset->url,
      "headerLogoLink": headerLogoUrl
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
