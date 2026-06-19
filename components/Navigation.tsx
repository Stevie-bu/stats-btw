"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { locales, getTranslations, getLocalizedPath } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity";
import type { SiteTexts, NavigationSettings } from "@/lib/sanity";

interface NavigationProps {
  locale: Locale;
  activePage: "topTen" | "facts" | "maps";
}

export function Navigation({ locale, activePage }: NavigationProps) {
  const t = getTranslations(locale);
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmsTexts, setCmsTexts] = useState<SiteTexts>({});
  const [navSettings, setNavSettings] = useState<NavigationSettings>({});
  const [activeLanguages, setActiveLanguages] = useState<string[]>(["de", "fr", "it", "en"]);
  const [mapsPublished, setMapsPublished] = useState(false);
  const [factsPublished, setFactsPublished] = useState(false);

  useEffect(() => {
    sanityClient.fetch(
      `*[_type == "siteTexts" && !(_id in path("drafts.**")) && sprache == $sprache][0] {
        navTopTen, navFacts, navMaps
      }`,
      { sprache: locale }
    ).then((r: SiteTexts | null) => setCmsTexts(r || {}));

    sanityClient.fetch(
      `*[_type == "navigationSettings" && !(_id in path("drafts.**"))][0] {
        "headerLogoUrl": headerLogo.asset->url,
        "headerLogoLink": headerLogoUrl
      }`
    ).then((r: NavigationSettings | null) => setNavSettings(r || {}));

    sanityClient.fetch<string[]>(
      `*[_type == "siteTexts" && !(_id in path("drafts.**")) && aktiv == true].sprache`
    ).then((r) => {
      if (r && r.length > 0) setActiveLanguages(r);
    });

    sanityClient.fetch<boolean | null>(
      `*[_type == "mapsPage" && !(_id in path("drafts.**")) && sprache == $sprache][0].published`,
      { sprache: locale }
    ).then((val) => setMapsPublished(val === true));

    sanityClient.fetch<boolean | null>(
      `*[_type == "factsPage" && !(_id in path("drafts.**")) && sprache == $sprache][0].published`,
      { sprache: locale }
    ).then((val) => setFactsPublished(val !== false));
  }, [locale]);

  const topTenLabel = cmsTexts.navTopTen || t.nav.topTen;
  const factsLabel = cmsTexts.navFacts || t.nav.factsAndFigures;
  const mapsLabel = cmsTexts.navMaps || t.nav.maps;

  const visibleLocales = locales.filter((l) => activeLanguages.includes(l));

  const navItems = [
    { label: topTenLabel, href: getLocalizedPath("/", locale), active: activePage === "topTen" },
    ...(factsPublished ? [{ label: factsLabel, href: getLocalizedPath("/facts-and-figures", locale), active: activePage === "facts" }] : []),
    ...(mapsPublished ? [{ label: mapsLabel, href: getLocalizedPath("/maps", locale), active: activePage === "maps" }] : []),
  ];

  function getLanguageSwitchPath(targetLocale: Locale) {
    let pagePath = "/";
    if (pathname.includes("facts-and-figures")) pagePath = "/facts-and-figures";
    else if (pathname.includes("maps")) pagePath = "/maps";
    return getLocalizedPath(pagePath, targetLocale);
  }

  return (
    <header className="bg-brand-pink">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="flex items-center gap-4 px-0 sm:px-4 lg:px-8 py-4">
          {/* Logo */}
          {navSettings.headerLogoLink ? (
            <a href={navSettings.headerLogoLink} target="_blank" rel="noopener noreferrer" className="shrink-0 size-16 sm:size-20 lg:size-[116px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={navSettings.headerLogoUrl || "/images/btw-logo.svg"}
                alt="bike to work"
                className="size-full object-contain"
              />
            </a>
          ) : (
            <Link href={getLocalizedPath("/", locale)} className="shrink-0 size-16 sm:size-20 lg:size-[116px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={navSettings.headerLogoUrl || "/images/btw-logo.svg"}
                alt="bike to work"
                className="size-full object-contain"
              />
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center gap-2 sm:gap-4">
            <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-0">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`h-10 sm:h-12 rounded-full px-3 sm:px-5 lg:px-6 text-sm sm:text-base lg:text-xl font-medium whitespace-nowrap transition-colors flex items-center ${
                    item.active
                      ? "bg-black text-brand-white"
                      : "bg-brand-white text-black hover:bg-black hover:text-brand-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Language Switcher */}
            <div className="relative shrink-0">
              <button
                onClick={() => setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                aria-label="Sprache wählen"
                className="flex items-center gap-1 text-base lg:text-xl font-medium text-black shrink-0 px-2 py-1 rounded-lg"
              >
                {locale.toUpperCase()}
                <svg
                  aria-hidden="true"
                  className={`size-3 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 12 6"
                  fill="none"
                >
                  <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {langOpen && (
                <ul role="menu" className="absolute right-0 top-full z-50 mt-2 rounded-xl bg-white py-2 shadow-lg">
                  {visibleLocales.map((l) => (
                    <li key={l} role="none">
                      <Link
                        role="menuitem"
                        href={getLanguageSwitchPath(l)}
                        onClick={() => setLangOpen(false)}
                        lang={l}
                        className={`block px-6 py-2 text-lg font-medium hover:bg-gray-100 ${
                          l === locale ? "text-brand-pink" : "text-black"
                        }`}
                      >
                        {l.toUpperCase()}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="flex md:hidden flex-1 items-center justify-end gap-3">
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-expanded={langOpen}
              aria-label="Sprache wählen"
              className="text-base font-medium text-black px-2 py-1"
            >
              {locale.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Menü schliessen" : "Menü öffnen"}
            >
              <span aria-hidden="true" className={`block h-0.5 w-6 bg-black transition-transform ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span aria-hidden="true" className={`block h-0.5 w-6 bg-black transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span aria-hidden="true" className={`block h-0.5 w-6 bg-black transition-transform ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav aria-label="Hauptnavigation mobil" className="md:hidden flex flex-col gap-2 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-full px-6 py-3 text-lg font-medium text-center transition-colors ${
                  item.active
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile Language Dropdown */}
        {langOpen && (
          <ul role="menu" className="md:hidden absolute right-4 top-20 z-50 rounded-xl bg-white py-2 shadow-lg">
            {visibleLocales.map((l) => (
              <li key={l} role="none">
                <Link
                  role="menuitem"
                  href={getLanguageSwitchPath(l)}
                  onClick={() => { setLangOpen(false); setMobileMenuOpen(false); }}
                  lang={l}
                  className={`block px-6 py-2 text-lg font-medium hover:bg-gray-100 ${
                    l === locale ? "text-brand-pink" : "text-black"
                  }`}
                >
                  {l.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
