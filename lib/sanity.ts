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
