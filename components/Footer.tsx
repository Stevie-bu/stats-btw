"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";
import type { SiteSettings, FooterTexts } from "@/lib/sanity";
import { getFooterSettings, getFooterTexts } from "@/lib/sanity";

interface FooterProps {
  locale: Locale;
}

const defaultMenuItems: Record<string, Array<{ label: string; url: string }>> = {
  de: [
    { label: "Über uns", url: "https://www.biketowork.ch" },
    { label: "Sponsoren", url: "https://www.biketowork.ch" },
    { label: "Kontakt", url: "https://www.biketowork.ch" },
    { label: "Newsletter", url: "https://www.biketowork.ch" },
  ],
  fr: [
    { label: "À propos", url: "https://www.biketowork.ch" },
    { label: "Sponsors", url: "https://www.biketowork.ch" },
    { label: "Contact", url: "https://www.biketowork.ch" },
    { label: "Newsletter", url: "https://www.biketowork.ch" },
  ],
  it: [
    { label: "Chi siamo", url: "https://www.biketowork.ch" },
    { label: "Sponsor", url: "https://www.biketowork.ch" },
    { label: "Contatto", url: "https://www.biketowork.ch" },
    { label: "Newsletter", url: "https://www.biketowork.ch" },
  ],
  en: [
    { label: "About us", url: "https://www.biketowork.ch" },
    { label: "Sponsors", url: "https://www.biketowork.ch" },
    { label: "Contact", url: "https://www.biketowork.ch" },
    { label: "Newsletter", url: "https://www.biketowork.ch" },
  ],
};

const defaultSocialLinks = [
  { platform: "Facebook", url: "https://www.facebook.com/biketowork", icon: "/images/facebook-icon.svg" },
  { platform: "Instagram", url: "https://www.instagram.com/biketowork_ch", icon: "/images/instagram-icon.svg" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/company/biketowork", icon: "/images/linkedin-icon.svg" },
];

const defaultSupporters = [
  { name: "Veloplus", logo: "/images/veloplus-logo.svg" },
  { name: "Panter", logo: "/images/panter-logo.svg" },
  { name: "Suva", logo: "/images/suva-logo.svg" },
  { name: "Stromer", logo: "/images/stromer-logo.svg" },
];

export function Footer({ locale }: FooterProps) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [footerTexts, setFooterTexts] = useState<FooterTexts>({});

  useEffect(() => {
    getFooterSettings().then(setSiteSettings);
    getFooterTexts(locale).then(setFooterTexts);
  }, [locale]);

  const t = getTranslations(locale);

  const menuItems = footerTexts.menuItems && footerTexts.menuItems.length > 0
    ? footerTexts.menuItems
    : defaultMenuItems[locale] || defaultMenuItems.de;

  const actionByLabel = footerTexts.actionByLabel || t.footer.actionBy;
  const supportedByLabel = footerTexts.supportedByLabel || t.footer.supportedBy;
  const copyrightText = footerTexts.copyrightText || "© 2026 bike to work";
  const termsLabel = footerTexts.termsLabel || t.footer.terms;
  const termsUrl = footerTexts.termsUrl || "https://www.biketowork.ch";
  const privacyLabel = footerTexts.privacyLabel || t.footer.privacy;
  const privacyUrl = footerTexts.privacyUrl || "https://www.biketowork.ch";

  const socialLinks = siteSettings.socialLinks && siteSettings.socialLinks.length > 0
    ? siteSettings.socialLinks
    : null;
  const actionByLogoUrl = siteSettings.actionByLogoUrl || null;
  const actionByUrl = siteSettings.actionByUrl || "https://www.pro-velo.ch";
  const supporters = siteSettings.supporters && siteSettings.supporters.length > 0
    ? siteSettings.supporters
    : null;

  return (
    <footer className="w-full">
      {/* Blue section */}
      <div className="bg-brand-blue">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 py-6 sm:py-8">
          <div className="px-0 sm:px-4 lg:px-8 flex flex-col gap-8 sm:gap-10 lg:gap-12">
            {/* Row 1: Nav links + Social icons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-2 text-base sm:text-lg lg:text-xl font-medium text-black">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="flex items-center gap-3 sm:gap-4">
                {socialLinks ? (
                  socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                    >
                      {link.iconUrl ? (
                        <Image src={link.iconUrl} alt="" width={40} height={40} unoptimized className="size-8 sm:size-10" />
                      ) : (
                        <span className="size-8 sm:size-10 flex items-center justify-center text-black font-bold">
                          {link.platform.charAt(0)}
                        </span>
                      )}
                    </a>
                  ))
                ) : (
                  defaultSocialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                    >
                      <Image src={link.icon} alt="" width={40} height={40} unoptimized className="size-8 sm:size-10" />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Row 2: Pro Velo + Sponsor logos */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-xs sm:text-sm text-brand-white">{actionByLabel}</p>
                <div className="pb-1 sm:pb-2">
                  {actionByLogoUrl ? (
                    <a href={actionByUrl} target="_blank" rel="noopener noreferrer">
                      <Image src={actionByLogoUrl} alt="Organisation" width={120} height={32} unoptimized className="h-6 sm:h-8 w-auto" />
                    </a>
                  ) : (
                    <a href={actionByUrl} target="_blank" rel="noopener noreferrer">
                      <Image src="/images/provelo-logo.svg" alt="Pro Velo" width={120} height={32} unoptimized className="h-6 sm:h-8 w-auto" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <p className="text-xs sm:text-sm text-brand-white">{supportedByLabel}</p>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
                  {supporters ? (
                    supporters.map((s) => (
                      <span key={s.name}>
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noopener noreferrer">
                            {s.logoUrl ? (
                              <Image src={s.logoUrl} alt={s.name} width={100} height={32} unoptimized className="h-5 sm:h-8 w-auto" />
                            ) : (
                              <span className="text-sm font-medium text-black">{s.name}</span>
                            )}
                          </a>
                        ) : s.logoUrl ? (
                          <Image src={s.logoUrl} alt={s.name} width={100} height={32} unoptimized className="h-5 sm:h-8 w-auto" />
                        ) : (
                          <span className="text-sm font-medium text-black">{s.name}</span>
                        )}
                      </span>
                    ))
                  ) : (
                    defaultSupporters.map((s) => (
                      <Image key={s.name} src={s.logo} alt={s.name} width={120} height={48} unoptimized className="h-8 sm:h-10 lg:h-12 w-auto" />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Black copyright bar */}
      <div className="bg-black px-4 sm:px-8 py-3 sm:py-4">
        <div className="mx-auto max-w-[1440px] px-0 sm:px-4 lg:px-16">
          <div className="flex items-center justify-between">
            <p className="text-sm sm:text-base text-neutral-lighter">{copyrightText}</p>
            <div className="flex items-center gap-6 sm:gap-10 text-sm sm:text-base text-neutral-lighter">
              <a href={termsUrl} rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                {termsLabel}
              </a>
              <a href={privacyUrl} rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                {privacyLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
